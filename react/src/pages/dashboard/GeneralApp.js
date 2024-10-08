import React from "react";
import Chats from "./Chats";
import { Box, Stack, Typography } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

const GeneralApp = () => {
  const theme = useTheme();
  const {sidebar} = useSelector((store)=> store.app);// access our store inside component
  
  const activeSessionId = useSelector((state) => state.app.activeSessionId); // Get the active session
  // // Assuming conversations are linked to session_id
  const chatSessions = useSelector((state) => state.app.chatSessions);
  
  const activeChat = chatSessions.find((session) => session.session_id === activeSessionId);
  // console.log(activeChat)
  // Assuming messages are stored within each chat session
  const messages = (() => {
    if (activeChat) {
      if (activeChat.model_name === "haiku and sonnet") {
        // Return an object with haiku and sonnet messages if model is 'haiku and sonnet'
        return {
          haiku: activeChat.haiku.messages || [],   // Default to empty array if messages are undefined
          sonnet: activeChat.sonnet.messages || []    // Default to empty array if messages are undefined
        };
      } else {
        // Return the messages array for any other model
        return {
          [activeChat.model_name]: activeChat[activeChat.model_name].messages || [] // Default to empty array if messages are undefined
        };
      }
    }
    // Return an empty object or array if activeChat is not defined
    return {}; // You can also choose to return [] based on your needs
  })();

  // console.log(activeChat)
  // console.log(messages)
  return (
    <Stack direction="row" sx={{ width: '100%' }}>
      <Chats />
  
      <Box 
        sx={{ 
          height: '100%', 
          width: sidebar.open ? 'calc(100vw - 740px)' : 'calc(100vw - 420px)',
          backgroundColor: theme.palette.mode === 'light' ? '#F0F4FA' : theme.palette.background.default,
          flexGrow: 1,        // Allow it to grow to fill the remaining space
          flexShrink: 0,      // Prevent shrinking when other elements stretch
          flexBasis: 'auto'   // Set the base size to auto
        }}
      >
        {/* Conditional rendering based on activeSessionId */}
        {chatSessions.some(session => session.session_id === activeSessionId) ? (
          <Conversation 
            activeSessionId={activeSessionId} 
            messages={messages} 
            model={activeChat ? activeChat.model_name : ''} 
          />
        ) : (
          <Box sx={{ textAlign: 'center', padding: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No active conversation selected.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please select a chat or start a new conversation.
            </Typography>
          </Box>
        )}
      </Box>
    </Stack>
  );
  
};

export default GeneralApp;
