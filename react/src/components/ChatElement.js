import { Avatar, Badge, Box, Stack, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

// Single chat element
const ChatElement = ({ session_id, model_name, img, msg, time, online, unread, isActive, onClick, onRemove }) => {
  const theme = useTheme();
  
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
          <Avatar alt={model_name} sx={{ color: 'black' }}>
            {model_name && model_name[0].toUpperCase()}
          </Avatar>
          <Stack spacing={0.3}>
            <Typography variant='subtitle2'>
              {model_name}
            </Typography>
            <Typography variant='caption'>
              {session_id}
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
