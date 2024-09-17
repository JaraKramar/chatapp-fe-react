import json
import uuid

import streamlit as st
# from streamlit_feedback import streamlit_feedback

from app.clients_creation import BackendChatbotClient
from app.settings import settings

st.set_page_config(
    page_title="ChatApp",
    layout="wide",
)


assistant_avatar = "app/avatar_img/csob_logo.png"
user_avatar = "app/avatar_img/user.png"
initial_message = (
    "Zdravím! Rád Vám odpovím na všechny vaše otázky. Jak Vám mohu pomoci?"
)
feedback1 = "Odpověď je chybná."
feedback2 = "Odpověď je částečně správně, ale chybí některé informace."
feedback3 = "Byly použity špatné zdroje."


# Clear Chat History fuction
def new_chat():
    st.session_state.messages = []
    del st.session_state.session_id


# Sidebar section
with st.sidebar:
    st.title("Sidebar Settings")
    st.button("New chat", on_click=new_chat)
    show_saved_hisory = st.toggle("Show saved history", value=True)
    #TODO: straming chat
    # stream_chat = st.toggle("Stream chat", value=False)
    stream_chat = False
    model_id = st.sidebar.selectbox(
        "Select LLM Model:", ["haiku", "sonnet"])
    search_method = st.sidebar.selectbox(
        "Search method:", ["l2_distance", "cosine_distance"]
    )
    search_limit = st.sidebar.selectbox("Search limit:", [num for num in range(20)])
    num_messages = st.sidebar.selectbox(
        "Num of last messages:", [num for num in range(50)] + [10000], index=50
    )


# if "boto_client" not in st.session_state:
#     st.session_state.boto_client = BotoClientCreator(
#         service_name="bedrock-runtime"
#     ).create()

st.session_state.chatbot = BackendChatbotClient(
    name = "Backend-chatbot",
    stage='development'
)

if "session_id" not in st.session_state:
    # Initialize the seassin_id ID
    st.session_state.session_id = str(uuid.uuid4())
    # Initialize the chat history
    st.session_state.messages = []
    # Initialize feedback ID
    st.session_state.feedback_key = str(uuid.uuid4())
    st.session_state.feedback_text = None
    st.session_state.feedback_instance = None

# Send the initial message
st.chat_message("assisten", avatar=assistant_avatar).write(initial_message)

# Display the chat history
for message in st.session_state.messages:
    avatar = assistant_avatar if message["role"] == "assistant" else user_avatar
    with st.chat_message(message["role"], avatar=avatar):
        st.markdown(message["content"])

# Handle user input
if prompt := st.chat_input("Type your message..."):

    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.chat_message("user", avatar=user_avatar):
        st.write(prompt)

    raw_output = st.session_state.chatbot.ragrespond(
        input_json={
            "model": model_id,
            "session_id": st.session_state.session_id,
            "prompt": st.session_state.messages[-(int(num_messages) * 2 + 1) :],
            "search": {
                "search_method": search_method,
                "search_limit": search_limit
            }
            }
    )

    raw_response = raw_output['response']
    api_request = raw_output['api_request']
    context = raw_output['context']

    with st.chat_message("assistant", avatar=assistant_avatar):
        # for test
        # st.write(raw_response)
        # TODO: streaming is not tested 
        # (Was takedn from different setup. Probably not working)
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

    st.session_state.messages.append({"role": "assistant", "content": prompt})
    # for test
    # st.session_state.messages.append({"role": "assistant", "content": "OK, BOOMER"})


#     # # Handle feedback
# if st.session_state.messages:
#     feedback_instance = streamlit_feedback(
#         feedback_type="thumbs",
#         # key=f"feedback_{st.session_state.feedback_key}",
#         optional_text_label="Uveďte prosím další informace",
#     )

#     if feedback_instance:
#         if feedback_instance["score"] == "👎":
#             feedback_score = "NEGATIVE"
#         elif feedback_instance["score"] == "👍":
#             feedback_score = "POSITIVE"

#         new_feedback = Feedback(
        #     log_id=st.session_state.new_log.log_id,
        #     feedback=feedback_score,
        #     comment=feedback_instance["text"],
        # )

        # st.session_state.database_client.add(new_feedback)
        # st.session_state.database_client.commit()
