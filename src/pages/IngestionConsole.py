# app.py
import streamlit as st
from llama_index.core import SimpleDirectoryReader
from llama_index.core.schema import Document as LlamaDocument

from src.backend.clients_creation import DatabaseClientCreator, S3BucketClient
from src.backend.ingestion.files_ingestion import TextFileIngestor
from src.backend.models.embeddings_model import LocalEmbeddingModel
from src.backend.types.config import settings

st.set_page_config(page_title="Ingestion console", layout="wide")

st.write("# Ingestion Console")

# Sidebar section
with st.sidebar:
    st.title("Sidebar Settings")
    use_test_file = st.toggle("Use test file", value=True)
    database_name = st.sidebar.selectbox(
        "Select database:", list(settings.database.keys())
    )
    model_id = st.sidebar.selectbox(
        "Select LLM Model:", list(settings.models_config.keys())
    )
    embeddings_model_name = st.sidebar.selectbox(
        "Select embedding model:", list(settings.embedding_model.keys())
    )
    chunk_size = st.sidebar.text_input(
        "Choose chunk size for text split:",
        value=settings.embedding_model[embeddings_model_name]["max_length"],
    )
    chunk_overlap = st.sidebar.text_input(
        "Choose chunk overlap for text split:", value=10
    )


s3 = S3BucketClient()

database_client_creator = DatabaseClientCreator(database_name=database_name)

embedding_model = LocalEmbeddingModel(model_name=embeddings_model_name)

text_file_ingestor = TextFileIngestor(
    database_client_creator=database_client_creator,
    embedding_model=embedding_model,
    st_print=st.write,
)

if use_test_file:
    storage_path = "src/test_file/short.txt"
    st.write(f"test file: {storage_path}")
else:
    storage_path = st.text_area("Enter your S3 URI/local path here:")

storage_path_split = storage_path.split("/")
execute_query = st.button("Start ingestion")

if execute_query:
    if storage_path_split[0] == "s3:":
        content = s3.get_output(storage_path)
    else:
        reader = SimpleDirectoryReader(input_files=[storage_path])
        docs: list[LlamaDocument] = reader.load_data()
        content = " ".join([doc.get_content() for doc in docs])

    text_file_ingestor.ingest(
        model_id, storage_path, content, chunk_size, chunk_overlap
    )
    st.write(f"document {storage_path} ingestion DONE")
