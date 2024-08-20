# import tempfile
# import hashlib
# from datetime import datetime
from typing import Protocol

import anthropic
from llama_index.core.node_parser import SentenceSplitter

from src.backend.chatbot import BaseBedrockChatBot

# import xmltodict
from src.backend.clients_creation import BotoClientCreator, DatabaseClientInterface
from src.backend.database.model import Chunk, Document
from src.backend.models.embeddings_model import EmbeddingModelInterface
from src.backend.prompts_creation import MainPromptCreator
from src.backend.types.config import settings

# from src.backend.models.index_model import IndexModelCreatorInterface


class FilesIngestorInterface(Protocol):
    def ingest(self, filepath) -> None:
        ...


class TextFileIngestor:
    def __init__(
        self,
        st_print,
        database_client_creator: DatabaseClientInterface,
        embedding_model: EmbeddingModelInterface,
    ):
        self.output = []
        self.st_print = st_print
        self._database_client, self.engine = database_client_creator.create()
        self._embeddings_model = embedding_model

        self.chat_bot = BaseBedrockChatBot(
            boto_client_creator=BotoClientCreator(service_name="bedrock-runtime"),
            main_prompt_creator=MainPromptCreator(),
        )

    def get_info(self, storage_path, content, llm_model):
        storage_path_split = storage_path.split("/")
        storage_path_split_dot = storage_path_split[-1].split(".")

        self.file_type = storage_path_split_dot[-1]
        self.file_name = storage_path_split_dot[0]

        self.file_summary, _ = self.chat_bot.respond_to_query(
            question=content, model_name=f"{llm_model}__summary"
        )
        self.file_keywords, _ = self.chat_bot.respond_to_query(
            question=content, model_name=f"{llm_model}__keywords"
        )

        self.file_keywords = self.file_keywords["content"][0]["text"].replace("\n", "")
        self.file_summary = self.file_summary["content"][0]["text"].replace("\n", "")

        self.file_keywords_split = self.file_keywords.split(" ")

    def simple_ingest(
        self, llm_model, storage_path, content, chunk_size, chunk_overlap
    ):
        self.get_info(storage_path, content, llm_model)

        new_document = Document(
            name=self.file_name,
            summary=self.file_summary,
            keywords=self.file_keywords_split,
            summary_embedding=self._embeddings_model.embed(self.file_summary),
            keyword_embedding=self._embeddings_model.embed(self.file_keywords),
            llm_model_id=settings.models_config[llm_model]["modelId"],
            embedding_model_id=self._embeddings_model.model_info["online_path"],
            user_role=["admin"],
            document_type=self.file_type,
            storage_path=storage_path,
            origin_path="xxx/path/to/origin/confluence",
        )

        self._database_client.add(new_document)
        self._database_client.commit()

        text_splitter = SentenceSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )
        # replace all 'new lines - \n'; without this, chunk is determited by new line
        chunks = text_splitter.split_text(content.replace("\n", ""))

        for chunk_order, chunk in enumerate(chunks):
            new_chunk = Chunk(
                content=chunk,
                embedding=self._embeddings_model.embed(chunk),
                chunk_order=chunk_order,
                document_id=new_document.document_id,
                page=0,
                embedding_model_id=self._embeddings_model.model_info["online_path"],
                token_count=anthropic.Client().count_tokens(chunk),
            )
            self._database_client.add(new_chunk)
            self._database_client.commit()

            self.st_print(f"{storage_path}: chunk number {chunk_order} -> ingested")

    def ingest(self, llm_model, storage_path, content, chunk_size, chunk_overlap):
        self.st_print("Ingest process is STARTING")
        self.simple_ingest(
            llm_model,
            storage_path,
            content,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )


# class PdfFilesIngestor:
# """
# Ingests PDF files into a search index.

# Args:
#     azure_openai_client_creator (AzureOpenAIClientCreatorInterface): Instance responsible for
#         creating an Azure OpenAI client.
#     container_client_creator (ContainerClientCreatorInterface): Instance responsible for
#         creating a container client to interact with Azure Blob Storage.
#     document_analysis_client_creator (DocumentAnalysisClientCreator): Instance responsible for
#         creating a document analysis client to process PDF documents.
#     index_model_creator (IndexModelCreatorInterface): Instance responsible for creating the model
#         for the search index.
#     search_client_creator (SearchClientCreatorInterface): Instance responsible for creating a
#         client to interact with the Azure Search Service.
#     search_index_client_creator (SearchIndexClientCreatorInterface): Instance responsible for
#         creating a client to manage the Azure Search Index.
#     chunker_factory (Callable[..., list[tuple[str, list[float]]]]): Factory function that takes
#         poller results and the OpenAI client and returns a list of chunk and embedding pairs.
#     uploader_factory (Callable[..., None]): Factory function that handles the uploading of the
#         processed data to the search index.
#     index_name (str): The name of the search index to which documents will be uploaded.
# """

# def __init__(
#     self,
#     azure_openai_client_creator: AzureOpenAIClientCreatorInterface,
#     container_client_creator: ContainerClientCreatorInterface,
#     document_analysis_client_creator: DocumentAnalysisClientCreator,
#     index_model_creator: IndexModelCreatorInterface,
#     search_client_creator: SearchClientCreatorInterface,
#     search_index_client_creator: SearchIndexClientCreatorInterface,
#     chunker_factory: Callable[..., list[tuple[str, list[float]]]],
#     uploader_factory: Callable[..., None],
#     index_name: str,
# ) -> None:
#     self._azure_openai_client = azure_openai_client_creator.create()
#     self._container_client = container_client_creator.create()
#     self._document_analysis_client = document_analysis_client_creator.create()
#     self._index_model = index_model_creator.create()
#     self._search_client = search_client_creator.create()
#     self._search_index_client = search_index_client_creator.create()
#     self._chunker_factory = chunker_factory
#     self._uploader_factory = uploader_factory
#     self._index_name = index_name

# def _recreate_index(self) -> None:
#     """
#     Helper method to recreate the search index.

#     Deletes the existing index and creates a new one based on the provided index model.

#     Returns:
#         None.
#     """

#     self._search_index_client.delete_index(index=self._index_name)
#     print(f"Index {self._index_name} deleted.")

#     self._search_index_client.create_index(index=self._index_model)
#     print(f"New index {self._index_name} created.")

# def ingest(self) -> None:
#     """
#     Ingests and processes PDF files, then uploads to the search index.

#     For each PDF file in the blob container, this method downloads the file, processes it
#     with a specified Document Analysis client, and uploads the resulting chunks and
#     their embeddings to the specified Azure search index.

#     Returns:
#         None.
#     """

#     self._recreate_index()
#     with tempfile.TemporaryDirectory():
#         blob_list = self._container_client.list_blobs()
#         for blob in blob_list:
#             if not blob.name.lower().endswith(".pdf"):
#                 continue

#             print(f"Processing {blob.name} file.")

#             blob_data = self._container_client.download_blob(blob.name).readall()

#             poller = self._document_analysis_client.begin_analyze_document(
#                 model_id="prebuilt-layout", document=blob_data
#             )
#             poller = poller.result()

#             chunk_embedding_pairs = self._chunker_factory(
#                 poller=poller, openai_client=self._azure_openai_client
#             )

#             # TODO: add metadata
#             self._uploader_factory(
#                 category="category",
#                 chunk_embeding_pairs=chunk_embedding_pairs,
#                 file_name=blob.name,
#                 metadata="",
#                 search_client=self._search_client,
#             )


# class XmlFilesIngestor:
# """
# Ingests XML files into a search index.

# Args:
#     azure_openai_client_creator (AzureOpenAIClientCreatorInterface): Instance responsible for
#         creating an Azure OpenAI client.
#     container_client_creator (ContainerClientCreatorInterface): Instance responsible for
#         creating a container client to interact with Azure Blob Storage.
#     index_model_creator (IndexModelCreatorInterface): Instance responsible for creating the model
#         for the search index.
#     search_client_creator (SearchClientCreatorInterface): Instance responsible for creating a
#         client to interact with the Azure Search Service.
#     search_index_client_creator (SearchIndexClientCreatorInterface): Instance responsible for
#         creating a client to manage the Azure Search Index.
#     embeddings_model (EmbeddingsModelInterface): Instance responsible for generating vector embeddings.
#     index_name (str): The name of the search index to which documents will be uploaded.
# """

# def __init__(
#     self,
#     azure_openai_client_creator: AzureOpenAIClientCreatorInterface,
#     container_client_creator: ContainerClientCreatorInterface,
#     index_model_creator: IndexModelCreatorInterface,
#     search_client_creator: SearchClientCreatorInterface,
#     search_index_client_creator: SearchIndexClientCreatorInterface,
#     embeddings_model: EmbeddingsModelInterface,
#     index_name: str,
# ) -> None:
#     self._azure_openai_client = azure_openai_client_creator.create()
#     self._container_client = container_client_creator.create()
#     self._index_model = index_model_creator.create()
#     self._search_client = search_client_creator.create()
#     self._search_index_client = search_index_client_creator.create()
#     self._index_name = index_name
#     self._embeddings_model = embeddings_model

# def _recreate_index(self) -> None:
#     """
#     Helper method to recreate the search index.

#     Deletes the existing index and creates a new one based on the provided index model.

#     Returns:
#         None.
#     """

#     self._search_index_client.delete_index(index=self._index_name)
#     print(f"Index {self._index_name} deleted.")

#     self._search_index_client.create_index(index=self._index_model)
#     print(f"New index {self._index_name} created.")

# def _process_xml_files(self) -> list[dict]:
#     """
#     Processes XML files and generates embeddings.

#     Downloads XML files from the blob container, parses them, and generates embeddings for
#     their contents.

#     Returns:
#         list[dict]: List of dictionaries with file content and embeddings.
#     """

#     with tempfile.TemporaryDirectory():
#         blob_list = self._container_client.list_blobs()
#         files = []
#         for blob in blob_list:
#             if not blob.name.lower().endswith(".xml"):
#                 continue
#             blob_data = self._container_client.download_blob(blob.name).readall()
#             file_as_dict = xmltodict.parse(blob_data)
#             file_as_str = str(file_as_dict)
#             files.append(
#                 {
#                     "id": blob.name.replace(".xml", ""),
#                     "content": file_as_str,
#                     "content_embeddings": self._embeddings_model.embed(
#                         azure_openai_client=self._azure_openai_client,
#                         text=file_as_str,
#                     ),
#                 }
#             )

#         return files

# def ingest(self) -> None:
#     """
#     Ingests and processes XML files, then uploads to the search index.

#     Processes XML files to extract content, generates embeddings, and uploads the data to the
#     specified Azure search index.

#     Returns:
#         None.
#     """

#     self._recreate_index()
#     print("Downloading files from blob storage...")
#     processed_files = self._process_xml_files()
#     print("Populating database ...")
#     self._search_client.upload_documents(documents=processed_files)
#     print("Upload of new documents succeeded.")
