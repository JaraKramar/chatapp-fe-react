# TODO: CREATE EMBEDDING CLASS FOR MODEL (IN BEDROCK OR SELF-HOSTED)

import os
from typing import List, Protocol

import streamlit as st
from FlagEmbedding import BGEM3FlagModel

# import torch
from transformers import AutoModel, AutoTokenizer

from src.backend.clients_creation import S3BucketClient
from src.backend.types.config import settings

# from openai import AzureOpenAI


class EmbeddingModelInterface(Protocol):
    def embed(self) -> List[float]:
        ...


# cash class globaly
@st.cache_resource
class LocalEmbeddingModel:
    def __init__(self, model_name: str = "RetroMAECS") -> None:
        # model_name = "Seznam/retromae-small-cs"  # Hugging Face link
        self.model_info = settings.embedding_model[model_name]
        self.model_local_name = self.model_info["local_path"]
        self.create()

    # TODO: download model from s3 bucket, if there is no model in local_model folder
    # def check_load_model(self):
    #     if not os.path.isfile(self.model_local_name):
    #         model = S3BucketClient().get_output(self.model_info["s3_path"])

    def create(self):
        if self.model_info["lib"] == "tokenizer":
            self._model = AutoModel.from_pretrained(self.model_local_name)
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_local_name)
        elif self.model_info["lib"] == "FlagEmbedding":
            self._model = BGEM3FlagModel(self.model_local_name, use_fp16=True)

    def embed(self, input_text: str) -> List[float]:
        # Tokenize the input texts
        if self.model_info["lib"] == "tokenizer":
            batch_dict = self.tokenizer(
                input_text,
                max_length=self.model_info["max_length"],
                padding=True,
                truncation=True,
                return_tensors="pt",
            )

            outputs = self._model(**batch_dict)

            if isinstance(input_text, list):
                return outputs.last_hidden_state[:, 0].detach().numpy().tolist()
            elif isinstance(input_text, str):
                return outputs.last_hidden_state[:, 0][0].detach().numpy().tolist()

        elif self.model_info["lib"] == "FlagEmbedding":
            outputs = self._model.encode(input_text)["dense_vecs"]

            return outputs.tolist()
