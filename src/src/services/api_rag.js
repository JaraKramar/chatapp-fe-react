import axios from "axios";
import { API_DOMAIN, LOADING_MSG_STATUS } from "../config";
import {
  addMessageToSession,
  removeLastMessageInSession,
} from "../redux/slices/app";
import { header, token, user } from "./auth";

// Function to handle message fetching
const fetchRAGResponse = async (
  _model,
  _content,
  _activeChatId,
  _messages,
  dispatch,
  _user = user,
  _header = header
) => {
  try {
    // Set a placeholder loading message (shown as 3 dots)
    dispatch(
      addMessageToSession({
        model: _model,
        sessionId: _activeChatId,
        message: { role: "assistant", content: LOADING_MSG_STATUS },
        references: "PLACEHOLDER_REFERENCE",
      })
    );
    // Prepare the payload for the request
    // console.log(_messages)
    const requestBody = {
      prompt: [..._messages, { role: "user", content: _content }].slice(-11),
      chat_id: _activeChatId,
      model_name: _model,
      user: _user?.profile?.["cognito:username"] || "",
      email: _user?.profile?.email || "",
    };

    try {
      // Send the request to the backend API
      const raw = await axios.post(
        `https://${API_DOMAIN}/backend`,
        requestBody,
        {
          headers: _header,
        }
      );
    } catch (error) {
      console.error("ERROR:", error.message);
      const raw = {
        data: {
          response: {},
          context: [],
          status: error.status,
        },
      };
    }

    // TEST DATA: do not remove
    // const raw = {
    //   data: {
    //     response: {
    //       role: "assistant",
    //       content: "ahoj od modelu, ako to ide ? ",
    //     },
    //     context: [
    //       { document_name: "test", document_path: "test.docx" },
    //       { document_name: "test2", document_path: "test2.docx" },
    //       { document_name: "test3", document_path: "test3.docx" },
    //       { document_name: "test4", document_path: "test5.docx" },
    //       { document_name: "test5", document_path: "test5.docx" },
    //     ],
    //   },
    // };
    // const raw = {
    //   data: {
    //     status: 200,
    //     response: {
    //       role: "assistant",
    //       content: "ahoj od modelu, ako to ide ? ",
    //     },
    //     context: [
    //       { document_name: "test", document_path: "test.docx" },
    //       { document_name: "test2", document_path: "test2.docx" },
    //       { document_name: "test3", document_path: "test3.docx" },
    //       { document_name: "test4", document_path: "test5.docx" },
    //       { document_name: "test5", document_path: "test5.docx" },
    //     ],
    //   },
    // };
    const { response, context, status } = raw.data;
    let formatedContext = context;
    let assistantMessage = response;

    if (status != 200) {
      assistantMessage = {
        role: "assistant",
        content: "Sorry, something went wrong. Please repeat the query.",
      };
      formatedContext = [];
    }

    // Remove loading message placeholder
    dispatch(
      removeLastMessageInSession({
        model: _model,
        sessionId: _activeChatId,
      })
    );

    return { assistantMessage, formatedContext };
  } catch (error) {
    console.error("Error fetching response:", error);
    // Optionally remove loading message on error as well
    dispatch(
      removeLastMessageInSession({
        model: _model,
        sessionId: _activeChatId,
      })
    );
    return { error: "Failed to fetch response from API" };
  }
};

export default fetchRAGResponse;
