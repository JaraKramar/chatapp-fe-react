import { Avatar, Badge, Box, Stack, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import {STRING_MODEL_CONNECTOR} from '../config'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';

// Single chat element
const ChatElement = ({ chat_id, model_name, img, msg, time, online, unread, isActive, onClick, onRemove }) => {
  const theme = useTheme();

  let modelNameConnected = []
  let modelNameConectedAvatar = []
  for (const key in model_name) {
    modelNameConectedAvatar[key] = model_name[key][0].toUpperCase()
    modelNameConnected[key] = modelNameConectedAvatar[key] + model_name[key].slice(1)
  }
  modelNameConectedAvatar = modelNameConectedAvatar.join('|')
  modelNameConnected = modelNameConnected.join(STRING_MODEL_CONNECTOR)

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (item) => {
    navigator.clipboard.writeText(chat_id).then(() => {
      console.log('Copied to clipboard!');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };
  
  return (
    <Box
      onClick={onClick} // Add click handler
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: isActive 
          ? theme.palette.primary.main // Change background for active chat
          : theme.palette.mode === 'light' 
            ? "#fff" 
            : theme.palette.background.default,
        cursor: 'pointer', // Change cursor to pointer
        '&:hover': {
          backgroundColor: theme.palette.primary.main, // Optional hover effect
        },
        // theme.palette.action.hover
      }}
      p={2}
    >
      <Stack direction="row" alignItems='center' justifyContent='space-between'>
        <Stack direction='row' spacing={2}>
          <Avatar 
            alt={modelNameConectedAvatar} 
            sx={{
              color: 'black',
            }}
          >
            {modelNameConectedAvatar}
          </Avatar>
          <Stack spacing={0.3}>
            <Typography variant='subtitle2'>
              {modelNameConnected}
            </Typography>
            <Typography 
              variant='h6'
              onClick={handleCopy}
              style={{ 
                cursor: 'pointer', 
                display: 'inline-block', 
                padding: '1px 2px', // Optional padding to make the color more visible 
                borderRadius: '8px', // Optional: to makethe background look nicer 
                }}
            >
                {!isCopied ? (
                <ContentCopyIcon
                  style={{
                    fontSize: 'inherit'
                  }}  
                />
                  ) : (
                    <span style={{
                      fontSize: 'inherit',
                      color: isCopied ? theme.palette.primary.contrastText : 'transparent', // This line iscorrect 
                    }}  
                    >
                    chat id copied
                    </span>
                  )
                }
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems='center'>
          <Typography sx={{ fontWeight: 600 }} variant='caption'>
            {time}
          </Typography>
          <Badge color='primary' badgeContent={unread}>
            {/* You can add content inside the badge if needed */}
          </Badge>
          <IconButton onClick={onRemove} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElement;
