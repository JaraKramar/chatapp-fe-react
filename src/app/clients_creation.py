import json
import os
from typing import Protocol
import requests

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from app.settings import settings

load_dotenv()


class BotoClientCreatorInterfase(Protocol):
    def create(self) -> boto3.client:
        ...

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
    

class RESTAPIClient:
    def __init__(self, name, stage="development") -> None:
        self.name = name
        self.stage = stage
        self.model_info = settings.api_resources[self.name]
        self.create()
        
    def create(self):
        self.header = self.model_info["header"]
        self.api_model_url = self.model_info["address"]

    def root(self):
        res = requests.get(f"{self.api_model_url}/{self.stage}/",
                           headers=self.header)     
        return res

    def ping(self):
        res = requests.get(f"{self.api_model_url}/{self.stage}/ping",
                           headers=self.header)
        return res


class EmeddingModelClient(RESTAPIClient):
    def __init__(self, name, stage) -> None:
        super().__init__(name, stage)

    def embed(self, input_text):
        res = requests.post(f"{self.api_model_url}/{self.stage}/embed", 
                           json={"input_text": input_text},
                           headers=self.header)

        out = json.loads(res.content)['response']        
        return out
    

class BackendChatbotClient(RESTAPIClient):
    def __init__(self, name, stage) -> None:
        super().__init__(name, stage)

    def ragrespond(self, input_json):
        res = requests.post(f"{self.api_model_url}/{self.stage}/ragrespond", 
                           json=input_json,
                           headers=self.header)
       
        return res
    
    # for test
    # def ragrespond(self, input_json):
        
       
    #     return {
    #         "response": input_json,
    #         "api_request": input_json,
    #         "context": input_json
    #     }
    
