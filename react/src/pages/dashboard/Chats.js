import React, { useEffect, useRef } from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AddChatSession, SetActiveSession, RemoveChatSession } from '../../redux/slices/app';
import ChatElement from '../../components/ChatElement';

const generateSessionId = () => {
  return crypto.randomUUID();
};

const Chats = () => {
  
  const theme = useTheme();
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null); // Create a ref for the scroll container
  
  const model = useSelector((state) => state.app.model);
  const chatSessions = useSelector((state) => state.app.chatSessions || []); // Ensure it defaults to an empty array
  const activeSessionId = useSelector((state) => state.app.activeSessionId); // Get the current active session

  // console.log(model)
  const handleNewChat = () => {
    // Generate a single chat_session value
    const chat_session = generateSessionId();
  
    // Check if model is "haiku a sonnet"
    if (model === "haiku a sonnet") {
      // Create two sessions with different session_id values but the same chat_session
      const newSession = {
        session_id: chat_session, // Same chat_session
        model_name: model, // Second model variant
        haiku: {
          chat_session: generateSessionId(),
          model_name: 'haiku',
          messages: []
        },
        sonnet: {
          chat_session: generateSessionId(),
          model_name: 'sonnet',
          messages: []
        }
      };
  
      // Dispatch both sessions
      dispatch(AddChatSession(newSession));
    } else {
      // For all other models, create a single session
      const newSession = {
        session_id: chat_session, // Single chat_session value
        model_name: model, // Current model value
        [model]: {
          chat_session: generateSessionId(),
          model_name: model,
          messages: []
        }
      };
  
      dispatch(AddChatSession(newSession));
    }
  };

  const handleChatClick = (session_id) => {
    dispatch(SetActiveSession(session_id)); // Set the clicked chat as the active session
  };

  const handleRemoveChat = (session_id) => {
    dispatch(RemoveChatSession(session_id)); // Remove the chat session
  };


  // Effect to scroll to the top when chatSessions change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0; // Scroll to the top
    }
  }, [chatSessions]); // Run the effect whenever chatSessions change

  return (    
    // <Box sx={{
    //   position: "relative",
    //   width: { xs: '30%', sm: '30%', md: '30%', lg: '15%' }, // Dynamic width based on screen size
    //   backgroundColor: theme.palette.mode === 'light' ? "#F8FAFF" : theme.palette.background.paper,
    //   boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
    // }}>
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
                    key={el.session_id}
                    onClick={() => handleChatClick(el.session_id)}
                    isActive={el.session_id === activeSessionId}
                    onRemove={() => handleRemoveChat(el.session_id)}
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
