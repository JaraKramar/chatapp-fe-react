import React, { useEffect, useRef } from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AddChatSession, SetActiveSession, RemoveChatSession } from '../../redux/slices/app';
import ChatElement from '../../components/ChatElement';
import  fetchPingRAGResponse from '../../services/api_pingrag'


const generateSessionId = () => {
  return crypto.randomUUID();
};

const Chats = () => {
  
  const theme = useTheme();
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null); // Create a ref for the scroll container
  
  const models = useSelector((state) => state.app.model);
  // console.log(models)

  const chatSessions = useSelector((state) => state.app.chatSessions || []); // Ensure it defaults to an empty array
  const activeSessionId = useSelector((state) => state.app.activeSessionId); // Get the current active session

  const handleNewChat = () => {
    // Generate a single chat_id value
    const chat_id = generateSessionId();
    
    const newSession = {
      chat_id: chat_id, // Same chat_id
      model_name: models
    }

    for (const key in models) {
      newSession[models[key]] = {
        conversation_id: generateSessionId(),
        model_name: models[key],
        messages: [],
        references: [],
        dotstatus: false
      };
    }
    // Dispatch both sessions
    dispatch(AddChatSession(newSession));

    // new chat == active chat
    handleChatClick(newSession.chat_id);

    // checkout backend status for model
    for (const key in models){
      fetchPingRAGResponse(models[key], newSession.chat_id, dispatch);
    }
    
  };

  const handleChatClick = (chat_id) => {
    dispatch(SetActiveSession(chat_id)); // Set the clicked chat as the active session
  };

  const handleRemoveChat = (chat_id) => {
    dispatch(RemoveChatSession(chat_id)); // Remove the chat session
  };


  // Effect to scroll to the top when chatSessions change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0; // Scroll to the top
    }
  }, [chatSessions]); // Run the effect whenever chatSessions change

  return (    
    <Box sx={{
      position: "relative",
      width: 300, 
      backgroundColor: theme.palette.mode === 'light' ? "#F8FAFF" : theme.palette.background.paper,
      boxShadow: '0px 0px 2px rgba(0,0,0,0.25)'
    }}>
      <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
        <Stack spacing={1} width="100%">
          <Typography variant='h5'>Chats</Typography>
          <Button variant="contained" color="primary" fullWidth onClick={handleNewChat}>
            New Chat
          </Button>
        </Stack>
    
        <Stack spacing={2.4}>
          <Typography variant='subtitle2' sx={{ color: "#676767" }}>
            All Chats
          </Typography>
        </Stack>
    
        {/* Scrollable container with hidden scrollbar */}
        <Stack 
          className='scrollbar' 
          spacing={2} 
          direction='column' 
          ref={scrollContainerRef} 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'scroll', // Enable scrolling
            // Hide the scrollbar
            '&::-webkit-scrollbar': {
              display: 'none', // For Chrome, Safari, and Edge
            },
            '-ms-overflow-style': 'none',  // For Internet Explorer and Edge
            'scrollbar-width': 'none',     // For Firefox
          }}
        >
          <Stack spacing={2.4}>
            {chatSessions.length > 0 ? (
              chatSessions
                .slice()
                .reverse()
                .map((el) => (
                  <ChatElement
                    {...el}
                    key={el.chat_id}
                    onClick={() => handleChatClick(el.chat_id)}
                    isActive={el.chat_id === activeSessionId}
                    onRemove={() => handleRemoveChat(el.chat_id)}
                  />
                ))
            ) : (
              <Typography variant="body2" sx={{ color: "#676767" }}>
                No chats available.
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
    
  );
};

export default Chats;
