import { Avatar, Box, Typography, Stack } from '@mui/material';
import React from 'react';
import { useTheme } from "@mui/material/styles";
import StyledBadge from '../StyledBadge';

const Header = ({ model }) => {
  const theme = useTheme();

  // Get the first letter of the model
  const firstLetterBig = model ? model[0].toUpperCase() + model.slice(1) : '';

  return (
    <Box p={2} sx={{ display: 'flex', alignItems: 'center', height: '70px', width: '100%', backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background.paper, boxShadow: '0px 0px 2px rgba(0,0,0,0.25)' }}>
      
      {/* Check model for rendering headers */}
      {model === "haiku and sonnet" ? (
        <>
          {/* First header for Haiku */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt="Haiku" sx={{ color: 'black' }}>
                H
              </Avatar>
            </StyledBadge>
            <Stack spacing={0.2} sx={{ marginLeft: 1 }}>
              <Typography variant='subtitle2'>Haiku</Typography>
              <Typography variant='caption'>Online</Typography>
            </Stack>
          </Box>

          {/* Vertical separator */}
          <Box
            sx={{
              width: '2px', // Width of the vertical line
              backgroundColor: theme.palette.divider, // Use a color from the theme
              height: '50px', // Set height based on avatar size
              marginLeft: 2,
              marginRight: 2,
            }}
          />

          {/* Second header for Sonnet */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt="Sonnet" sx={{ color: 'black' }}>
                S
              </Avatar>
            </StyledBadge>
            <Stack spacing={0.2} sx={{ marginLeft: 1 }}>
              <Typography variant='subtitle2'>Sonnet</Typography>
              <Typography variant='caption'>Online</Typography>
            </Stack>
          </Box>
        </>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            <Avatar alt={model} sx={{ color: 'black' }}>
              {model && model[0].toUpperCase()} {/* Show first letter of the model name */}
            </Avatar>
          </StyledBadge>
          <Stack spacing={0.2} sx={{ marginLeft: 1 }}>
            <Typography variant='subtitle2'>
              {firstLetterBig}
            </Typography>
            <Typography variant='caption'>
              Online
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default Header;
