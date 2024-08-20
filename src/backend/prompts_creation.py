# import json
from typing import Protocol

from src.backend.types.config import settings


class PromptCreatorInterface(Protocol):
    def create(self) -> str:
        ...


class MainPromptCreator:
    """Creates the main prompt string that provides instructions and context to
    the assistant."""

    def create(self, model_name) -> str:
        return settings.system_prompt[model_name]


class HistoryContextPromptCreator:
    """Creates prompt strings intended to encapsulate chat history and last
    user question for the assistant."""

    def create(self, model_name: str) -> str:
        return (
            settings.history_context[model_name]
            + """\n\
        Chat history: \n\
        {chat_history}\n\
        User question:\n\
        {user_query}
        """
        )
