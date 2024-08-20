from datetime import datetime
from typing import Dict, List, Protocol

import psycopg2
import streamlit as st
from sqlalchemy import func, select

from src.backend.clients_creation import DatabaseClientInterface
from src.backend.database.model import Chunk
from src.backend.models.embeddings_model import EmbeddingModelInterface

# from src.backend.types.config import setting


class SearchHandler(Protocol):
    """Base class for search handlers."""

    def search(self, conversation_history: List[Dict]) -> List[Dict]:
        """
        Abstract method for search.

        Args:
            conversation_history (List[Dict]): List with {role, content} dictionaries.

        Returns:
            List[Dict]: The search results.
        """
        ...


class SearchDatabaseHandler:
    """Basic search database handler that uses a search client to search for
    results."""

    def __init__(
        self,
        search_method,
        search_limit,
        database_client: DatabaseClientInterface,
        embedding_model: EmbeddingModelInterface,
    ):
        self._search_method = search_method
        self._search_limit = search_limit
        self._database_client = database_client
        self._embedding_model = embedding_model

    def _format_history_as_text(self, conversation_history: List[Dict]) -> str:
        """
        Formats the conversation history as text. Removes roles and adds new
        messages separators.

        Args:
            conversation_history (List[Dict]): List with {role, content} dictionaries.

        Returns:
            str: The formatted conversation history.
        """
        history_text = ""
        for h in conversation_history:
            # if h['role'] == 'user':
            history_text += f"{h['content']}\n"
        return history_text

    def search(self, conversation_history: List[Dict]) -> List[Dict]:
        """
        Search for the text using the search client.

        Args:
            conversation_history (List[Dict]): List with {role, content} dictionaries.

        Returns:
            List[Dict]: The search results.
        """
        question = self._format_history_as_text(conversation_history)

        question_embedded = self._embedding_model.embed(input_text=question)

        def to_bytea(vector):
            return psycopg2.Binary(vector.tobytes())

        if self._search_method == "l2_distance":
            distance = Chunk.embedding.l2_distance(question_embedded)

        elif self._search_method == "cosine_distance":
            distance = Chunk.embedding.cosine_distance(question_embedded)

        query_start = datetime.now()
        search_output = (
            self._database_client.query(Chunk, distance.label("distance"))
            .order_by(distance)
            .limit(self._search_limit)
            .all()
        )
        query_end = datetime.now()

        self.query_time = (query_end - query_start).total_seconds() * 1000

        return search_output