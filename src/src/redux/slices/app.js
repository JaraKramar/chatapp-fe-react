import { createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
    sidebar: {
        selected: 0,
        open: false,
        type: "CONTACT", // can be CONTACT, STARRED, SHARED
    },
    model: ["sonnet3.5"], // Add the model variable to the state
    allChatIds: [], // Initialize allChatIds as an empty array
    activeChatId: null,
    signoutStatus: false,
};

// Create slice
const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateSidebarSelected(state, action) {
            state.sidebar.selected = action.payload;
        },
        // Update model
        updateModel(state, action) {
            state.model = action.payload; // Update the model variable
        },
        // Add a new chat session
        addChatSession(state, action) {
            // Ensure allChatIds is defined
            if (!state.allChatIds) {
                state.allChatIds = []; // Fallback to an empty array if undefined
            }
            state.allChatIds.push(action.payload);
        },
        removeChatSession: (state, action) => {
            state.allChatIds = state.allChatIds.filter(session => session.chatId !== action.payload);
            
        },
        changeDotStatus:  (state, action) => {
            const { model, sessionId, status } = action.payload;
            const session = state.allChatIds.find(session => session.chatId === sessionId);

            if (session) {
                session[model].dotstatus = status;
            }
        },
        addMessageToSession: (state, action) => {
            const { model, sessionId, message, references } = action.payload;
            const session = state.allChatIds.find(session => session.chatId === sessionId);

            if (session) {
                // check if chatId is for two conversation mode
                if (session.modelName.length >= 2) {
                    // check if we want to put data into separate models 
                    // or same info into both models
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
        removeLastMessageInSession: (state, action) => {
            const { model, sessionId } = action.payload;
            const session = state.allChatIds.find(session => session.chatId === sessionId);
            
            if (session) {         
                    session[model].messages = session[model].messages.slice(0, -1);
                    session[model].references = session[model].references.slice(0, -1);
            }

            // if (session) {
            //     if (session.modelName === 'haiku and sonnet') {
            //         if (model !== 'haiku and sonnet') {
            //             session[model].messages = session[model].messages.slice(0, -1);
            //         } else {
            //             session.haiku.messages = session[model].messages.slice(0, -1);
            //             session.sonnet.messages = session[model].messages.slice(0, -1);
            //         }
            //     } else {            
            //         session[model].messages = session[model].messages.slice(0, -1);
            //         session[model].references = session[model].references.slice(0, -1);
            //     }
            // }

        },
        setActiveSession: (state, action) => {
            state.activeChatId = action.payload;
        },
        setSignoutStatus(state, action) {
            state.signoutStatus = action.payload;
        },

    },
});

// Export reducer
export default slice.reducer;

// Export actions
export const { 
    updateSidebarSelected,
    updateModel, 
    addChatSession, 
    removeChatSession, 
    setActiveSession, 
    addMessageToSession,
    removeLastMessageInSession,
    setSignoutStatus,
    changeDotStatus
} = slice.actions;
