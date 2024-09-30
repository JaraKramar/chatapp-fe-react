import { createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
    sidebar: {
        open: false,
        type: "CONTACT", // can be CONTACT, STARRED, SHARED
    },
    model: "haiku", // Add the model variable to the state
    chatSessions: [], // Initialize chatSessions as an empty array
    activeSessionId: null,
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
            state.chatSessions = state.chatSessions.filter(session => session.session_id !== action.payload);
            
        },
        AddMessageToSession: (state, action) => {
            const { model, sessionId, message } = action.payload;
            const session = state.chatSessions.find(session => session.session_id === sessionId);
            
            if (session) {
                if (session.model_name === 'haiku a sonnet') {
                    if (model !== 'haiku a sonnet') {
                        session[model].messages.push(message);
                    } else {
                        session.haiku.messages.push(message);
                        session.sonnet.messages.push(message);
                    }
                } else {
                    // For other models, push to the general messages array
                    session[model].messages.push(message);
                }
            }
        },
        SetActiveSession: (state, action) => {
            state.activeSessionId = action.payload;
        },
    },
});

// Export reducer
export default slice.reducer;

// Export actions
export const { toggleSidebar, updateSidebarType, updateModel, AddChatSession, RemoveChatSession, SetActiveSession, AddMessageToSession } = slice.actions;

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
