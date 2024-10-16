import { createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
    sidebar: {
        open: false,
        type: "CONTACT", // can be CONTACT, STARRED, SHARED
    },
    model: ["sonnet3.5"], // Add the model variable to the state
    chatSessions: [], // Initialize chatSessions as an empty array
    activeSessionId: null,
    signoutStatus: false,
    logged_user: null,
};

// Create slice
const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        // Toggle sidebar
        toggleSidebar(state) {
            state.sidebar.open = !state.sidebar.open;
        },
        updateSidebarType(state, action) {
            state.sidebar.type = action.payload.type;
        },
        // Update model
        updateModel(state, action) {
            state.model = action.payload; // Update the model variable
        },
        // Add a new chat session
        AddChatSession(state, action) {
            // Ensure chatSessions is defined
            if (!state.chatSessions) {
                state.chatSessions = []; // Fallback to an empty array if undefined
            }
            state.chatSessions.push(action.payload);
        },
        RemoveChatSession: (state, action) => {
            state.chatSessions = state.chatSessions.filter(session => session.chat_id !== action.payload);
            
        },
        ChangeDotStatus:  (state, action) => {
            const { model, sessionId, status } = action.payload;
            const session = state.chatSessions.find(session => session.chat_id === sessionId);

            if (session) {
                if (session.model_name === 'haiku and sonnet') {
                    if (model !== 'haiku and sonnet') {
                        session[model].dotstatus = status;
                    } else {
                        session.haiku.dotstatus = status;
                        session.sonnet.dotstatus = status;
                    }
                } else {
                    // For other models, push to the general messages array
                    // console.log(session[model].messages)
                    session[model].dotstatus = status;
                }
            }
        },
        AddMessageToSession: (state, action) => {
            const { model, sessionId, message, references } = action.payload;
            const session = state.chatSessions.find(session => session.chat_id === sessionId);

            if (session) {
                if (session.model_name.length >= 2) {
                    if (model.length !== 2) {
                        session[model].messages.push(message);
                        session[model].references.push(references);
                    } else {
                        for (const key in model) {
                            session[model[key]].messages.push(message);
                            session[model[key]].references.push(references);
                        }
                    } 
                } else {
                    session[model].messages.push(message);
                    session[model].references.push(references);
                }
            }
        },
        RemoveLastMessageInSession: (state, action) => {
            const { model, sessionId } = action.payload;
            const session = state.chatSessions.find(session => session.chat_id === sessionId);
            

            if (session) {
                if (session.model_name === 'haiku and sonnet') {
                    if (model !== 'haiku and sonnet') {
                        session[model].messages = session[model].messages.slice(0, -1);
                    } else {
                        session.haiku.messages = session[model].messages.slice(0, -1);
                        session.sonnet.messages = session[model].messages.slice(0, -1);
                    }
                } else {            
                    session[model].messages = session[model].messages.slice(0, -1);
                    session[model].references = session[model].references.slice(0, -1);
                }
            }

        },
        SetActiveSession: (state, action) => {
            state.activeSessionId = action.payload;
        },
        SetSignoutStatus(state, action) {
            state.signoutStatus = action.payload;
        },
        SetLoggedUser(state, action) {
            state.logged_user = action.payload;
        },

    },
});

// Export reducer
export default slice.reducer;

// Export actions
export const { 
    toggleSidebar, 
    updateSidebarType, 
    updateModel, 
    AddChatSession, 
    RemoveChatSession, 
    SetActiveSession, 
    AddMessageToSession,
    RemoveLastMessageInSession,
    SetSignoutStatus,
    SetLoggedUser,
    ChangeDotStatus
} = slice.actions;

// Thunk functions - perform async operations
export function ToggleSidebar() {
    return async (dispatch) => {
        dispatch(slice.actions.toggleSidebar());
    };
}

export function UpdateSidebarType(type) {
    return async (dispatch) => {
        dispatch(slice.actions.updateSidebarType({ type }));
    };
}

// New thunk for updating the model
export function UpdateModel(model) {
    return async (dispatch) => {
        dispatch(slice.actions.updateModel(model)); // Dispatch the updateModel action
    };
}
