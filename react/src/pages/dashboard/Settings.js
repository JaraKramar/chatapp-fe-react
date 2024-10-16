import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useTheme } from "@mui/material/styles";
import Conversation from '../../components/Conversation';
import { useSelector, useDispatch } from 'react-redux';
import { UpdateModel } from '../../redux/slices/app';
import { model_options } from '../../data';
import { FormControl, FormLabel, FormControlLabel, Checkbox } from "@mui/material";


const Settings = () => {
    const {sidebar} = useSelector((store) => store.app);
    
    const dispatch = useDispatch();  // Get the dispatch function
    const selectedModel = useSelector((state) => state.app.model);  // Access selected model from Redux store
    console.log(selectedModel)

    // Function to handle model change
    const handleModelChange = (event) => {
        const { name } = event.target;
        if (selectedModel.includes(name)) {
            // If already selected, remove it
            dispatch(UpdateModel(selectedModel.filter(model => model !== name)));
        } else {
            if (selectedModel.length >= 2) {
              const updatedModels = [...selectedModel.slice(1), name];
              dispatch(UpdateModel(updatedModels));
            } else {
              // If not selected, add it
              dispatch(UpdateModel([...selectedModel, name]));
            };
        }
    };
    const theme = useTheme();
    // Fetch the model from Redux (or wherever your state is)
    const activeSessionId = useSelector((state) => state.app.activeSessionId); // Get the active session
    const chatSessions = useSelector((state) => state.app.chatSessions);
    const activeChat = chatSessions.find((session) => session.chat_id === activeSessionId);
    
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
    return (
        <>
            <Stack direction='row' sx={{ width: '100%' }}>
                <Box sx={{
                    position: "relative",
                    width: 300,
                    backgroundColor: theme.palette.mode === 'light' ? "#F8FAFF" : theme.palette.background.paper,
                    boxShadow: '0px 0px 2px rgba(0,0,0,0.25)'
                }}>
                    <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
                        {/* Header */}
                        <Stack direction="row" alignItems='center' justifyContent='space-between'>
                            <Typography variant='h5'>
                                Settings
                            </Typography>
                        </Stack>
                        {/* List of options */}
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Models</FormLabel>
                            {model_options.map((option) => (
                                <FormControlLabel
                                    key={option.id}
                                    control={
                                        <Checkbox
                                            checked={selectedModel.includes(option.value)} // Check if selected
                                            onChange={handleModelChange} // Handle change
                                            name={option.value} // Set name for checkbox
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {option.label}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                                {option.desc}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        wordBreak: 'break-word', // Breaks long words into multiple lines
                                        overflowWrap: 'break-word', // Ensures proper wrapping in older browsers
                                        whiteSpace: 'pre-wrap',
                                        marginBottom: 2
                                    }}
                                />
                            ))}
                        </FormControl>
                    </Stack>
                </Box>
                {/* Right panel */}
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
        </>
    );
};
export default Settings;
