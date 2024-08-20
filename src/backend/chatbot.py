import json
from datetime import datetime

import streamlit as st

from src.backend.clients_creation import BotoClientCreator
from src.backend.prompts_creation import PromptCreatorInterface
from src.backend.search import SearchHandler
from src.backend.types.config import settings


class BaseBedrockChatBot:
    def __init__(
        self,
        boto_client_creator: BotoClientCreator,
        main_prompt_creator: PromptCreatorInterface,
    ):
        self._boto_client = boto_client_creator.create()
        self._main_prompt = main_prompt_creator

    def setup_api_request(self, model_name):
        self.api_request = settings.models_config[model_name]

    # TODO: add try:
    def invoke_model(self, stream):
        if stream:
            response = self._boto_client.invoke_model_with_response_stream(
                body=json.dumps(self.api_request["body"]),
                modelId=self.api_request["modelId"],
                accept=self.api_request["accept"],
                contentType=self.api_request["contentType"],
            )
            output = response
        else:
            response = self._boto_client.invoke_model(
                body=json.dumps(self.api_request["body"]),
                modelId=self.api_request["modelId"],
                accept=self.api_request["accept"],
                contentType=self.api_request["contentType"],
            )
            output = json.loads(response.get("body").read())

        return output, self.api_request

    def respond_to_query(self, question: str, model_name: str, stream=False):
        self.setup_api_request(model_name.split("__")[0])

        self.api_request["body"]["system"] = self._main_prompt.create(model_name)
        self.api_request["body"]["messages"] = [{"role": "user", "content": question}]

        output, self.api_request = self.invoke_model(stream=stream)

        return output, self.api_request


class BedrockChatBot(BaseBedrockChatBot):
    def __init__(
        self,
        boto_client: BotoClientCreator,
        history_context_prompt_creator: PromptCreatorInterface,
        main_prompt_creator: PromptCreatorInterface,
        search_handler: SearchHandler,
    ):
        self._boto_client = boto_client
        self._main_prompt = main_prompt_creator
        self._search_handler = search_handler
        # self._history_context_prompt = history_context_prompt_creator.create("haiku")
        self.conversation_history = []

    def _format_all_prompt(self, search_result: list[dict] = None):
        """Build system prompt with system prompt and context and messages
        prompt from conversation history."""
        context = []
        self.chunk_score = {}

        if search_result:
            for row, distance_value in search_result:
                context.append(
                    f"----\
                    \ndocument_id: {row.document_id}\
                    \npage: {row.page}\
                    \nchunk_order: {row.chunk_order}\
                    \ncontent: {row.content}"
                )
                self.chunk_score[row.chunk_id] = distance_value

        self.api_request["body"]["system"] = "\n".join(self._main_prompt + context)
        self.api_request["body"]["messages"] = self.conversation_history

    def respond_to_query(self, question: str, model_name: str, stream=False):
        """Main respond to query, fetching data from vectors, the query prompt
        for a app."""

        self._main_prompt = [self._main_prompt.create(model_name)]

        self.setup_api_request(model_name)

        search_result = self._search_handler.search(
            conversation_history=self.conversation_history
        )

        self._format_all_prompt(search_result)
        invoke_start = datetime.now()
        output, self.api_request = self.invoke_model(stream=stream)
        invoke_end = datetime.now()

        self.invoke_time = (invoke_end - invoke_start).total_seconds() * 1000

        return output, self.api_request


# TODO: dependent on search index fields structure, i.e., id, content & embeddings names
# class ChatBot:
#     """
#     A conversational agent that interacts with users and provides responses.

#     The ChatBot integrates with Azure OpenAI services to generate text completions, uses search
#     capabilities to find relevant information, and manages conversation history for context.

#     Args:
#         azure_openai_client_creator (AzureOpenAIClientCreatorInterface): An instance responsible
#             for creating an Azure OpenAI client for interacting with OpenAI services.
#         search_client_creator (SearchClientCreatorInterface): An instance responsible for creating
#             a search client for querying a search service for relevant information.
#         chat_history_factory (Callable[..., str]): A factory function that produces a string
#             representation of the chat history when called.
#         embeddings_model (EmbeddingsModelInterface): Instance responsible for generating vector embeddings.
#         main_prompt_creator (PromptCreatorInterface): An instance responsible for creating the main
#             prompt used to generate chat responses.
#         history_context_prompt_creator (PromptCreatorInterface): An instance responsible for creating
#             historical context prompts for the chat bot.
#     """

#     def __init__(
#         self,
#         azure_openai_client_creator: AzureOpenAIClientCreatorInterface,
#         embeddings_model: EmbeddingsModelInterface,
#         main_prompt_creator: PromptCreatorInterface,
#         history_context_prompt_creator: PromptCreatorInterface,
#         search_handler: SearchHandler,
#     ) -> None:
#         self._azure_openai_client = azure_openai_client_creator.create()
#         self._embeddings_model = embeddings_model
#         self._history_context_prompt = history_context_prompt_creator.create()
#         self._main_prompt = main_prompt_creator.create()
#         self.conversation_history = []
#         self._search_handler = search_handler

#     def _convert_to_history(self, search_result: list[dict] = None):
#         """Build prompt conversation history."""
#         history = (
#             [
#                 {
#                     "role": "system",
#                     "content": f"""
#                     {self._main_prompt}
#                     """,
#                 }
#             ]
#             + self.conversation_history
#             + [
#                 {
#                     "role": "function",
#                     "name": "retrieve_relevant_information",
#                     "content": "\n".join(
#                         [
#                             f"title : {x['id']}, content: {x['content']}"
#                             for x in search_result
#                         ]
#                     ),
#                 }
#             ]
#         )
#         return history

#     def respond_to_query(self, question: str):
#         """Main respond to query, fetching data from vectors, the query prompt
#         for a app."""
#         self.conversation_history.append({"role": "user", "content": question})

#         search_result = self._search_handler.search(
#             conversation_history=self.conversation_history
#         )
#         sources = [(x["sourcefile"], x["sourcepage"]) for x in search_result]
#         history = self._convert_to_history(search_result)
#         response = (
#             self._azure_openai_client.chat.completions.create(
#                 model=settings.AZURE_OPENAI_GPT_DEPLOYMENT,
#                 messages=history,
#                 temperature=0.3,
#                 max_tokens=1024,
#                 stop=["<|im_end|>"],
#                 timeout=20,
#             )
#             .choices[0]
#             .message.content
#         )
#         self.conversation_history.append({"role": "assistant", "content": response})
#         return response, sources
