import json
import os
from typing import Protocol

import boto3
import streamlit as st
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

from src.backend.database.model import Base, metadata
from src.backend.types.config import settings

load_dotenv()


class BotoClientCreatorInterfase(Protocol):
    def create(self) -> boto3.client:
        ...


class DatabaseClientInterface(Protocol):
    def create(self) -> sessionmaker:
        ...


# class SearchIndexClientCreatorInterface(Protocol):
#     def create(self) -> SearchIndexClient:
#         ...


class BotoClientCreator:
    def __init__(self, service_name: str, running_local=False) -> None:
        self._region = settings.aws_variables["region_name"]
        self._service_name = service_name
        self.running_local = running_local

    def create(self) -> boto3.client:
        if os.path.isfile("/app/.env"):
            # --> container or code is running in local (need .env)
            return boto3.client(
                service_name=self._service_name,
                region_name=self._region,
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            )
        else:
            # --> container is running in ecs <-> cloud (does not need .env)
            return boto3.client(
                service_name=self._service_name, region_name=self._region
            )


class DatabaseClientCreator:
    def __init__(self, database_name) -> None:
        self._database_name = database_name
        self.make_url()

    def make_url(self):
        dbc = settings.database[self._database_name]

        if isinstance(dbc["password"], dict):
            password = SecretManagerClient().get_output(dbc["password"]["SECRET"])[
                "password"
            ]
        else:
            password = dbc["password"]
        self._database_url = f"{dbc['dialect_driver']}://{dbc['username']}:{password}@{dbc['host']}:{dbc['port']}/{dbc['database']}"

    def create_extension(self):
        with self.engine.connect() as con:
            con.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            con.commit()
            print("Vector Extension created")

    def reflect_data(self):
        self.create()
        metadata.reflect(bind=self.engine)
        tables = metadata.tables.keys()

        return tables

    # TODO: ADD OUTPUT FORMAT
    def create(self):
        self.make_url()

        self.engine = create_engine(self._database_url)
        Session = sessionmaker(bind=self.engine)
        Base.metadata.create_all(self.engine)
        return Session(), self.engine


class S3BucketClient:
    def __init__(self) -> None:
        self.s3 = BotoClientCreator(service_name="s3").create()

    def get_output(self, filepath: str):
        try:
            filename_clean = filepath.replace("s3://", "").split("/")
            bucket = filename_clean[0]
            key = filename_clean[1:]

            data = self.s3.get_object(Bucket=bucket, Key=key)
            content = data["Body"].read().decode("utf-8")
        except ClientError as error:
            print(error)
        return content


class SecretManagerClient:
    def __init__(self) -> None:
        self.secret_manager = BotoClientCreator(service_name="secretsmanager").create()

    def get_output(self, secret_name: str):
        try:
            response = self.secret_manager.get_secret_value(SecretId=secret_name)

            secret_string = response["SecretString"]
            secret_dict = json.loads(secret_string)
            print("Secret manager part done")
        except ClientError as error:
            print(error)
        return secret_dict


# class SearchIndexClientCreator:
#     """
#     Factory for creating a SearchIndexClient for managing an Azure Cognitive
#     Search index.

#     Args:
#         api_key (str): The API key for the Azure Cognitive Search service.
#         endpoint (str): The endpoint URL for the Azure Cognitive Search service.
#         index_name (str): The name of the search index to be managed.
#     """

#     def __init__(self, api_key: str, endpoint: str, index_name: str) -> None:
#         self._api_key = api_key
#         self._endpoint = endpoint
#         self._index_name = index_name

#     def create(self) -> SearchIndexClient:
#         return SearchIndexClient(
#             credential=AzureKeyCredential(self._api_key),
#             endpoint=self._endpoint,
#             index_name=self._index_name,
#         )
