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
  // // Assuming conversations are linked to chat_id
  const chatSessions = useSelector((state) => state.app.chatSessions);
  
  const activeChat = chatSessions.find((session) => session.chat_id === activeSessionId);
  console.log(activeChat)

  const messages = (() => {
    const output = {};

    if (activeChat) {
      const allModels = activeChat.model_name;

      for (const key in allModels) {
        output[allModels[key]] = {
          messages: activeChat[allModels[key]].messages || [],
          references: activeChat[allModels[key]].references || []
        }
      };
      return output;
    }
    // Return an empty object or array if activeChat is not defined
    return {}; 
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
        {chatSessions.some(session => session.chat_id === activeSessionId) ? (
          <Conversation 
            activeSessionId={activeSessionId} 
            activeChat={activeChat}
            messages={messages} 
            models={activeChat ? activeChat.model_name : ''} 
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
