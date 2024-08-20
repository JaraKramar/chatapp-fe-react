import json
import os

import yaml
from pydantic import BaseModel

# class Settings():
#     """
#     Configuration settings for the application.

#     This class defines various settings that are used throughout the application.
#     It relies on pydantic's BaseSettings for environment management and type validation.

#     Attributes:
#         AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT (str): The name of the Azure OpenAI embeddings model deployment.
#         AZURE_OPENAI_GPT_DEPLOYMENT (str): The name of the Azure OpenAI GPT model deployment.
#         AZURE_SEARCH_INDEX_NAME (str): The name of the Azure Cognitive Search index to be used.
#         FEEDBACK_FILE_NAME (str): The file name for storing feedback on the ChatBot's responses.
#         CHUNK_SIZE (int): The size of text chunks used in processing documents (number of characters).
#         OVERLAP (int): The number of characters to overlap between consecutive chunks if overlap is used.
#         USE_OVERLAP (bool): Flag to determine if overlapping text chunks should be used.
#     """

# AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT: str = "embeddings-3-small"
# AZURE_OPENAI_GPT_DEPLOYMENT: str = "gpt-35-turbo-16k"
# AZURE_SEARCH_INDEX_NAME: str = "zentiva-document-search"
# AZURE_STORAGE_ACCOUNT_NAME: str = "devgenaistorage"
# AZURE_STORAGE_CONTAINER_NAME: str = "zentiva"
# FEEDBACK_FILE_NAME: str = "feedback.csv"
# CHUNK_SIZE: int = 500
# OVERLAP: int = 50
# USE_OVERLAP: bool = False
# CHUNK_COUNT: int = 5
# )


class DynamicSettings(BaseModel):
    class Config:
        extra = "allow"  # Allow extra fields not explicitly defined in the model


class Settings:
    def __init__(self, files_path: str = "src/configs"):
        self._files_path = files_path

    def read_json(self, path):
        try:
            with open(path, "r") as f:
                data = json.load(f)
            return data
        except json.JSONDecodeError as e:
            print(f"Error reading {path}: {e}")

    def read_yaml(self, path):
        try:
            with open(path, "r") as file:
                data = yaml.safe_load(file)
            return data
        except yaml.YAMLError as e:
            print(f"Error reading {path}: {e}")

    def read_all(self) -> DynamicSettings:
        output_data = {}
        for filename in os.listdir(self._files_path):
            if filename.endswith(".json"):
                clean_name = filename.replace(".json", "")
                file_path = os.path.join(self._files_path, filename)
                function = self.read_json
            elif filename.endswith(".yaml"):
                clean_name = filename.replace(".yaml", "")
                file_path = os.path.join(self._files_path, filename)
                function = self.read_yaml

            output_data[clean_name] = function(file_path)
        return DynamicSettings(**output_data)


# Load settings from the JSON file
settings = Settings().read_all()

# print(settings.system_prompt['haiku'])
