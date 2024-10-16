import axios from 'axios';
import { api_domain, LOADING_MSG_STATUS } from '../config';
import { useDispatch } from 'react-redux';
import { AddMessageToSession, SetLoadingMSGStatus, RemoveLastMessageInSession } from '../redux/slices/app';
import { header, token, user } from './auth'


// Function to handle message fetching
const fetchRAGResponse = async (_model, _content, _activeSessionId, _messages, dispatch, _user=user, _header=header) => {
  try {
    // Set a placeholder loading message (shown as 3 dots)
    dispatch(AddMessageToSession({
      model: _model,
      sessionId: _activeSessionId,
      message: { role: "assistant", content: LOADING_MSG_STATUS },
      references: "PLACEHOLDER_REFERENCE"
    }));
    // Prepare the payload for the request
    // console.log(_messages)
    const requestBody = {
      prompt: [..._messages, { role: "user", content: _content }].slice(-11),
      session_id: _activeSessionId,
      model_name: _model,
      user: _user?.profile?.['cognito:username'] || '',
      email: _user?.profile?.email || ''
    };
    // Send the request to the backend API
    const raw = await axios.post(`https://${api_domain}/backend`, requestBody, { _header });

    // TEST DATA: do not remove
    // const raw = {
    //   data: {
    //     response: {
    //       role: "assistant",
    //       content: "ahoj od modelu, ako to ide ? "
    //     },
    //     context: [
    //       { document_name: 'test', document_path: 'test.docx' },
    //       { document_name: 'test2', document_path: 'test2.docx' },
    //       { document_name: 'test3', document_path: 'test3.docx' },
    //       { document_name: 'test4', document_path: 'test5.docx' },
    //       { document_name: 'test5', document_path: 'test5.docx' }
    //     ]
    //   }
    // };
    console.log(raw)
    const { response, context } = raw.data;

    const formatedContext = context;
    const assistantMessage = response;

    // Remove loading message placeholder 
    dispatch(RemoveLastMessageInSession({
      model: _model,
      sessionId: _activeSessionId,
    }));

    return {assistantMessage, formatedContext};
  } catch (error) {
    console.error('Error fetching response:', error);
    // Optionally remove loading message on error as well
    dispatch(RemoveLastMessageInSession({
      model: _model,
      sessionId: _activeSessionId,
    }));
    return { error: 'Failed to fetch response from API' };
  }
};

export default fetchRAGResponse;