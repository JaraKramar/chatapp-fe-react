import os

import streamlit as st

from src.backend.types.config import settings

st.set_page_config(
    page_title="CSOB RAG Assistant",
    page_icon="📚",
)

# Main Header
st.write("# CSOB RAG Assistant 📚")

model_id = list(settings.models_config.keys())
model_id_text = "".join([f"\n- {model_name}" for model_name in model_id])

embedding_model = list(settings.embedding_model.keys())
embedding_model_id_text = "".join(
    [f"\n- {model_name}" for model_name in embedding_model]
)

pages = os.listdir("src/pages")
pages.reverse()
pages_text = "".join([f"\n- {page.replace('.py', '')}" for page in pages])


# Introduction
st.markdown(
    """
    CSOB RAG Assistant is a project, that provides a Chat app,
    for communication between you and different LLM models.\n

    Using a database full of custom documents to obtain better answers about asked topics.
    """
)
st.markdown(f"#### LLM models: {model_id_text}")
st.markdown(f"#### Embedding models: {embedding_model_id_text}")
st.markdown(f"#### App pages: {pages_text}")
