import json
import uuid
from datetime import datetime

import streamlit as st
from streamlit_feedback import streamlit_feedback

from src.backend.chatbot import BedrockChatBot
from src.backend.clients_creation import BotoClientCreator, DatabaseClientCreator
from src.backend.database.model import Feedback, Log
from src.backend.models.embeddings_model import LocalEmbeddingModel
from src.backend.prompts_creation import HistoryContextPromptCreator, MainPromptCreator
from src.backend.search import SearchDatabaseHandler
from src.backend.types.config import settings

st.set_page_config(
    page_title="ChatApp",
    layout="wide",
)


assistant_avatar = "src/backend/avatar_img/csob_logo.png"
user_avatar = "src/backend/avatar_img/user.png"
initial_message = (
    "Zdravím! Rád Vám odpovím na všechny vaše otázky. Jak Vám mohu pomoci?"
)
feedback1 = "Odpověď je chybná."
feedback2 = "Odpověď je částečně správně, ale chybí některé informace."
feedback3 = "Byly použity špatné zdroje."


# Clear Chat History fuction
def new_chat():
    st.session_state.messages = []
    del st.session_state.conversation_id


# Sidebar section
with st.sidebar:
    st.title("Sidebar Settings")
    st.button("New chat", on_click=new_chat)
    show_saved_hisory = st.toggle("Show saved history", value=True)
    stream_chat = st.toggle("Stream chat", value=True)
    model_id = st.sidebar.selectbox(
        "Select LLM Model:", list(settings.models_config.keys())
    )
    embeddings_model_name = st.sidebar.selectbox(
        "Select embedding model:", list(settings.embedding_model.keys())
    )
    database_name = st.sidebar.selectbox(
        "Select database:", list(settings.database.keys())
    )
    search_method = st.sidebar.selectbox(
        "Search method:", ["l2_distance", "cosine_distance"]
    )
    search_limit = st.sidebar.selectbox("Search limit:", [num for num in range(20)])
    num_messages = st.sidebar.selectbox(
        "Num of last messages:", [num for num in range(50)] + [10000], index=50
    )


if "boto_client" not in st.session_state:
    st.session_state.boto_client = BotoClientCreator(
        service_name="bedrock-runtime"
    ).create()


if "database_client" not in st.session_state and "engine" not in st.session_state:
    st.session_state.database_client, st.session_state.engine = DatabaseClientCreator(
        database_name=database_name
    ).create()

embedding_model = LocalEmbeddingModel(model_name=embeddings_model_name)

st.session_state.search_handler = SearchDatabaseHandler(
    search_method=search_method,
    search_limit=search_limit,
    database_client=st.session_state.database_client,
    embedding_model=embedding_model,
)

st.session_state.chatbot = BedrockChatBot(
    boto_client=st.session_state.boto_client,
    history_context_prompt_creator=HistoryContextPromptCreator(),
    main_prompt_creator=MainPromptCreator(),
    search_handler=st.session_state.search_handler,
)

if "conversation_id" not in st.session_state:
    # Initialize the conversation ID
    st.session_state.conversation_id = str(uuid.uuid4())
    # Initialize feedback ID
    st.session_state.feedback_key = str(uuid.uuid4())
    # Initialize the chat history
    st.session_state.messages = []
    st.session_state.systemp_prompt = []
    st.session_state.feedback_text = None
    st.session_state.feedback_instance = None
    st.session_state.sources = None
    st.session_state.search_result = []

# Send the initial message
st.chat_message("assisten", avatar=assistant_avatar).write(initial_message)

# Display the chat history
for message in st.session_state.messages:
    avatar = assistant_avatar if message["role"] == "assistant" else user_avatar
    with st.chat_message(message["role"], avatar=avatar):
        st.markdown(message["content"])

# Handle user input
if prompt := st.chat_input("Type your message..."):
    timestamp_received = datetime.now()

    st.session_state.messages.append({"role": "user", "content": prompt})

    # connect "backend" and "frontend" messages
    if len(st.session_state.messages) == 0:
        st.session_state.chatbot.conversation_history = st.session_state.messages
    else:
        st.session_state.chatbot.conversation_history = st.session_state.messages[
            -(int(num_messages) * 2 + 1) :
        ]

    with st.chat_message("user", avatar=user_avatar):
        st.write(prompt)

    raw_response, api_request = st.session_state.chatbot.respond_to_query(
        prompt, model_name=model_id, stream=stream_chat
    )
    timestamp_responded = datetime.now()

    with st.chat_message("assistant", avatar=assistant_avatar):
        if stream_chat:
            placeholder = st.empty()
            full_response = ""
            for event in raw_response.get("body"):
                chunk = json.loads(event.get("chunk").get("bytes").decode())
                if chunk["type"] == "content_block_delta":
                    full_response += chunk["delta"]["text"]
                    placeholder.markdown(full_response)
                elif chunk["type"] == "message_stop":
                    tokens_in = chunk["amazon-bedrock-invocationMetrics"][
                        "inputTokenCount"
                    ]
                    tokens_out = chunk["amazon-bedrock-invocationMetrics"][
                        "outputTokenCount"
                    ]
            placeholder.markdown(full_response)
        else:
            tokens_in = raw_response["usage"]["input_tokens"]
            tokens_out = raw_response["usage"]["output_tokens"]
            full_response = raw_response["content"][0]["text"]
            st.write(full_response)

        if show_saved_hisory:
            st.write(api_request)

    st.session_state.messages.append({"role": "assistant", "content": full_response})

    st.session_state.new_log = Log(
        timestamp_received=timestamp_received,
        timestamp_responded=timestamp_responded,
        duration_ms_retrieval=st.session_state.search_handler.query_time,
        duration_ms_generation=st.session_state.chatbot.invoke_time,
        session_id=st.session_state.conversation_id,
        user_id="test_user",
        llm_model_id=1,
        embedding_model_id=1,
        query=prompt,
        generated_answer=full_response,
        chunk_ids=list(st.session_state.chatbot.chunk_score.keys()),
        chunk_scores_similarity=list(st.session_state.chatbot.chunk_score.values()),
        search_method=search_method,
        num_messages=num_messages,
        tokens_in=tokens_in,
        tokens_out=tokens_out,
        system_prompt_version=1,
        error_message="",
    )

    st.session_state.database_client.add(st.session_state.new_log)
    st.session_state.database_client.commit()

    # reset feedback key so you can save multiple in one session
    # st.session_state.feedback_key = str(uuid.uuid4())

    # # Handle feedback
if st.session_state.messages:
    feedback_instance = streamlit_feedback(
        feedback_type="thumbs",
        # key=f"feedback_{st.session_state.feedback_key}",
        optional_text_label="Uveďte prosím další informace",
    )

    if feedback_instance:
        if feedback_instance["score"] == "👎":
            feedback_score = "NEGATIVE"
        elif feedback_instance["score"] == "👍":
            feedback_score = "POSITIVE"

        new_feedback = Feedback(
            log_id=st.session_state.new_log.log_id,
            feedback=feedback_score,
            comment=feedback_instance["text"],
        )

        st.session_state.database_client.add(new_feedback)
        st.session_state.database_client.commit()
