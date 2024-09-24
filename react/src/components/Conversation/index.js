import { Box, Stack } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useTheme } from "@mui/material/styles";
import Header from './Header';
import Footer from './Footer';
import Message from './Message';

const Conversation = ({model, activeSessionId, messages}) => {
    const theme = useTheme();

    const scrollContainerRef = useRef(null); // Create a ref for the scroll container
    const scrollContainerRef2 = useRef(null); // Create a ref for the scroll container

    useEffect(() => {
      if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight; // Scroll to the bottom
      }
    }, [messages]); // Run the effect whenever chatSessions change

    useEffect(() => {
      if (scrollContainerRef2.current) {
        scrollContainerRef2.current.scrollTop = scrollContainerRef2.current.scrollHeight; // Scroll to the bottom
      }
    }, [messages]); // Run the effect whenever chatSessions change
  
    console.log(messages)
    return (
      <Stack height={'100vh'} width={'auto'}>
        {/* Chat header */}
        <Box sx={{ flexShrink: 0 }}>
          <Header model={model} />
        </Box>
        
        {/* Conditionally render either one message or two side by side */}
        {model === "haiku a sonnet" ? (
          <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            flexGrow: 1,  // Take remaining space between header and footer
            overflow: 'hidden', // Prevent vertical overflow
            width: '100%' 
          }}
        >
          {/* Combined message container with its own vertical scroll */}
          <Box 
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
            className="scrollbar"
          >
            {/* Map through messages for the combined message box */}
            <Message menu={false} messages={messages} />
          </Box>
        
          {/* Vertical separator */}
          <Box
            sx={{
              width: '2px', // Width of the vertical line
              backgroundColor: theme.palette.divider, // Use a color from the theme
              height: '100%',
            }}
          />
        
          {/* You can place additional content here if needed */}
          <Box 
            ref={scrollContainerRef2}
            sx={{ 
              flexGrow: 1, 
              overflowY: 'scroll', // Enable scrolling for the second area
              // Hide the scrollbar
              '&::-webkit-scrollbar': {
                display: 'none', // For Chrome, Safari, and Edge
              },
              '-ms-overflow-style': 'none',  // For Internet Explorer and Edge
              'scrollbar-width': 'none',     // For Firefox
            }}
            className="scrollbar"
          >
            {/* You can add other content/messages here */}
            <Message menu={false} messages={messages} />
          </Box>
        </Box>
        
        ) : (
          <Box 
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
            className="scrollbar"
          >
          <Message menu={false} messages={messages} />
          </Box>
        )}

        {/* Chat footer */}
        <Box sx={{ flexShrink: 0 }}>
          <Footer activeSessionId={activeSessionId}/>
        </Box>
      </Stack>
    );
}

export default Conversation;
