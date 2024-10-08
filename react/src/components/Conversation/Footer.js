import { Box, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { styled, useTheme } from "@mui/material/styles";
import { PaperPlaneTilt } from 'phosphor-react';
// import { Camera, File } from 'phosphor-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { AddMessageToSession } from '../../redux/slices/app';
import { useDispatch } from 'react-redux';
import axios from 'axios'
import {congnito_domain, client_id, api_domain, JWKSDomain} from '../../config'

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: '12px',
    paddingBottom: '12px',
  }
}));
// const Actions = [
//   {
//     color:'#0172E4',
//     icon: <Camera size={24}/>,
//     y:102,
//     title:'Image'
//   },
//   {
//     color:'#0159B2',
//     icon: <File size={24}/>,
//     y:172,
//     title:'Document'
//   },
// ];
const ChatInput = ({ setOpenPicker, inputValue, onInputChange, onSendMessage }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) { // Only send message if Enter is pressed without Shift
      e.preventDefault(); // Prevent newline in the TextField
      onSendMessage(inputValue);
    }
  };
//   const StyledInput = styled(TextField)(({ theme }) => ({
//     "& .MuiInputBase-input": {
//         paddingTop: '12px',
//         paddingBottom: '12px',
//         borderRadius: '12px', // Adjust this value as needed for roundness
//     },
//     "& .MuiFilledInput-root": {
//         borderRadius: '12px', // Make the input itself rounded
//     },
// }));
  return (
    <StyledInput
      fullWidth
      placeholder='Write a message...'
      variant='filled'
      value={inputValue}
      onChange={onInputChange}
      onKeyDown={handleKeyDown} // Listen for Enter key press using onKeyDown
      InputProps={{
        disableUnderline: true,
        // startAdornment: (
        //   <Stack sx={{width:'max-content'}}>
        //     <Stack sx={{position:'relative', display: openAction ? 'inline-block' : 'none'}}>
        //       {Actions.map((el) => (
        //         <Tooltip key={el.title} placement='right' title={el.title}>
        //           <Fab sx={{position:'absolute', top: -el.y, backgroundColor: el.color}}>
        //             {el.icon}
        //           </Fab>
        //         </Tooltip>
        //       ))}
        //     </Stack>
        //     <InputAdornment>
        //       <IconButton onClick={() => setOpenAction((prev) => !prev)}>
        //         <LinkSimple />
        //       </IconButton>
        //     </InputAdornment>
        //   </Stack>
        // ),
        // endAdornment: (
        //   <InputAdornment>
        //     <IconButton onClick={() => setOpenPicker((prev) => !prev)}>
        //       <Smiley />
        //     </IconButton>
        //   </InputAdornment>
        // ),
      }}
    />
  );
};
const Footer = ({ activeSessionId, model, messages }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openPicker, setOpenPicker] = useState(false);
  const [inputValue, setInputValue] = useState(''); // State for the input value
  const user_raw = sessionStorage[`oidc.user:https://${congnito_domain}:${client_id}`] || null;
  const user = JSON.parse(user_raw)

  const _token = user['access_token'];

  const sendMessage = async (content) => {
    if (content.trim() && activeSessionId) {
      // Add user message to the session
      dispatch(AddMessageToSession({
        model: model,
        sessionId: activeSessionId,
        message: { role: "user", content: content }
      }));
      setInputValue(''); // Clear input after sending
      
      const _header = {
        Authorization: `Bearer ${_token}`,
        'Content-Type': `application/json`
      };
      try {
        if (model === "haiku and sonnet") {
          // If the model is "haiku and sonnet", make two requests simultaneously
          const [response1, response2] = await Promise.all([
            axios.post(`https://${api_domain}/backend`, {
              prompt: [...messages.haiku, { role: "user", content: content }].slice(-11),
              session_id: activeSessionId,
              model_name: 'haiku' // First model
            },
            {
              headers: _header
            }),
            axios.post(`https://${api_domain}/backend`, {
              prompt: [...messages.sonnet, { role: "user", content: content }].slice(-11),
              session_id: activeSessionId,
              model_name: 'sonnet' // Second model
            },
            {
              headers: _header
            })
          ]);
          // Handle responses from both models
          // const assistantMessage1 = { role: "assistant", content: "hello from haiku" };
          // const assistantMessage2 = { role: "assistant", content: "hello from sonnet" };

          const assistantMessage1 = response1.data;
          const assistantMessage2 = response2.data;
          // Add both assistant messages to the session
          dispatch(AddMessageToSession({
            model: 'haiku',
            sessionId: activeSessionId,
            message: assistantMessage1 // Response from the first model
          }));
          dispatch(AddMessageToSession({
            model: 'sonnet',
            sessionId: activeSessionId,
            message: assistantMessage2 // Response from the second model
          }));
        } else {
          // Normal flow: single request to the model
          const response = await axios.post(`https://${api_domain}/backend`, 
          {
            prompt: [...messages[model], { role: "user", content: content }].slice(-11),
            session_id: activeSessionId,
            model_name: model
          },
          {
            headers: _header
          });
          // Assuming response contains the assistant's reply in the format { role: "assistant", content: "..." }
          const assistantMessage = response.data;
          // Add assistant message to the session
          // const assistantMessage = { role: "assistant", content: "hello from stano" };

          dispatch(AddMessageToSession({
            model: model,
            sessionId: activeSessionId,
            message: assistantMessage // The response from the API
          }));
        }
      } catch (error) {
        console.error('Failed to fetch assistant message:', error);
        // Handle error here, e.g., dispatch an error message to the chat
      }
    }
  };
  return (
    <Box p={2} sx={{ width: '100%', backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background.paper, boxShadow: '0px 0px 2px rgba(0,0,0,0.25)' }}>
      <Stack direction='row' alignItems={'center'} spacing={3}>
        <Stack sx={{ width: '100%' }}>
          {/* Chat Input */}
          <Box sx={{ display: openPicker ? 'inline' : 'none', zIndex: 10, position: 'fixed', bottom: 81, right: 100 }}>
            <Picker theme={theme.palette.mode} data={data} onEmojiSelect={console.log} />
          </Box>
          <ChatInput
            setOpenPicker={setOpenPicker}
            inputValue={inputValue}
            onInputChange={(e) => setInputValue(e.target.value)} // Update inputValue on change
            onSendMessage={sendMessage} // Pass sendMessage function to ChatInput
          />
        </Stack>
        <Box sx={{ height: 48, width: 48, backgroundColor: theme.palette.primary.main, borderRadius: 1.5 }}>
          <Stack sx={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton onClick={() => sendMessage(inputValue)}> {/* Send inputValue */}
              <PaperPlaneTilt color='#fff' />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
export default Footer;