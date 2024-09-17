import json
import os

import yaml
from pydantic import BaseModel


class DynamicSettings(BaseModel):
    class Config:
        extra = "allow"  # Allow extra fields not explicitly defined in the model


class Settings:
    def __init__(self, files_path: str = "configs"):
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