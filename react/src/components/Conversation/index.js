import { Box, Stack } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useTheme } from "@mui/material/styles";
import Header from './Header';
import Footer from './Footer';
import Message from './Message';


const Conversation = ({model, activeSessionId, activeChat, messages}) => {
    const theme = useTheme();
    const scrollContainerRef = useRef(null); // Create a ref for the scroll container
    const scrollContainerRef2 = useRef(null); // Create a ref for the scroll container
    useEffect(() => {
      if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight; // Scroll to the bottom
      }
    }, [messages]); // Run the effect whenever messages change
    useEffect(() => {
      if (scrollContainerRef2.current) {
        scrollContainerRef2.current.scrollTop = scrollContainerRef2.current.scrollHeight; // Scroll to the bottom
      }
    }, [messages]); // Run the effect whenever messages change
    return (
      <Stack height={'100vh'} width={'auto'}>
        {/* Chat header */}
        <Box sx={{ flexShrink: 0 }}>
          <Header model={model} activeChat={activeChat} />
        </Box>
        {/* Conditionally render either one message or two side by side */}
        {model === "haiku and sonnet" ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,  // Take remaining space between header and footer
              overflow: 'hidden', // Prevent vertical overflow
              width: '100%'
            }}
          >
            {/* First message container with its own vertical scroll */}
            <Box
              ref={scrollContainerRef}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                flexBasis: '50%', // Occupy 50% of the available width
                overflowY: 'auto', // Enable scrolling
                minHeight: 0, // Prevent the box from growing too much
                // Hide the scrollbar
                '&::-webkit-scrollbar': {
                  display: 'none', // For Chrome, Safari, and Edge
                },
                '-ms-overflow-style': 'none',  // For Internet Explorer and Edge
                'scrollbar-width': 'none',     // For Firefox
              }}
              className="scrollbar"
            >
              {/* Map through messages for the haiku message box */}
              <Message menu={false} messages={messages.haiku} />
            </Box>
            {/* Vertical separator */}
            <Box
              sx={{
                width: '2px', // Width of the vertical line
                backgroundColor: theme.palette.divider, // Use a color from the theme
                height: '100%',
              }}
            />
            {/* Second message container with its own vertical scroll */}
            <Box
              ref={scrollContainerRef2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                flexBasis: '50%', // Occupy 50% of the available width
                overflowY: 'auto', // Enable scrolling for the second area
                minHeight: 0, // Prevent the box from growing too much
                // Hide the scrollbar
                '&::-webkit-scrollbar': {
                  display: 'none', // For Chrome, Safari, and Edge
                },
                '-ms-overflow-style': 'none',  // For Internet Explorer and Edge
                'scrollbar-width': 'none',     // For Firefox
              }}
              className="scrollbar"
            >
              {/* Map through messages for the sonnet message box */}
              <Message menu={false} messages={messages.sonnet} />
            </Box>
          </Box>
        ) : (
          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              overflowY: 'auto', // Enable scrolling
              minHeight: 0, // Prevent the box from growing too much
              // Hide the scrollbar
              '&::-webkit-scrollbar': {
                display: 'none', // For Chrome, Safari, and Edge
              },
              '-ms-overflow-style': 'none',  // For Internet Explorer and Edge
              'scrollbar-width': 'none',     // For Firefox
            }}
            className="scrollbar"
          >
          <Message menu={false} messages={messages[model]} />
          </Box>
        )}
        {/* Chat footer */}
        <Box sx={{ flexShrink: 0 }}>
          <Footer activeSessionId={activeSessionId} messages={messages} model={model}/>
        </Box>
      </Stack>
    );
}
export default Conversation;