import React, { useState } from 'react';
import { Box, Divider, IconButton, Stack, Switch } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { Gear, SignOut } from "phosphor-react"; // Import SignOut icon
import { Nav_Buttons } from '../../data';
import useSettings from '../../hooks/useSettings';
import { useDispatch } from 'react-redux';
import Logo from '../../assets/Images/csob_logo.png';
import { SetSignoutStatus } from '../../redux/slices/app'

import { useNavigate } from 'react-router-dom';

const getPath = (index) => {
  switch (index) {
    case 0:
      return '/app';
    case 1:
      return '/group';
    case 2:
      return '/call';
    case 3:
      return '/settings';
    default:
      break;
  }
};

const SideBar = () => {

  const dispatch = useDispatch()
  const theme = useTheme();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const { onToggleMode } = useSettings();

  const handleSignOut = () => {
    console.log("Sign out");
    dispatch(SetSignoutStatus(true));
  };

  return (
    <Box p={2} sx={{ backgroundColor: theme.palette.background.paper, boxShadow: "0px 0px 2px rgba(0,0,0,0.25)", height: "100vh", width: 100, display: "flex" }}>
      <Stack direction="column" alignItems={"center"} justifyContent="space-between" sx={{ width: "100%", height: "100%" }} spacing={3}>
        <Stack alignItems={"center"} spacing={4}>
          <Box sx={{ backgroundColor: theme.palette.primary.main, height: 64, width: 64, borderRadius: 1.5 }}>
            <img src={Logo} alt={'Logo icon'} />
          </Box>
          <Stack sx={{ width: "max-content" }} direction="column" alignItems="center" spacing={3}>
            {Nav_Buttons.map((el) => (
              el.index === selected ?
                <Box key={el.index} sx={{ backgroundColor: theme.palette.primary.main, borderRadius: 1.5 }}>
                  <IconButton sx={{ width: "max-content", color: "#fff" }} key={el.index}>
                    {el.icon}
                  </IconButton>
                </Box>
                :
                <IconButton onClick={() => { setSelected(el.index); navigate(getPath(el.index)) }} 
                  sx={{ width: "max-content", color: theme.palette.mode === 'light' ? "#000" : theme.palette.text.primary }} key={el.index}>
                  {el.icon}
                </IconButton>
            ))}
            <Divider sx={{ width: "48px" }} />
            {selected === 3 ?
              <Box sx={{ backgroundColor: theme.palette.primary.main, borderRadius: 1.5 }}>
                <IconButton sx={{ width: "max-content", color: "#fff" }}>
                  <Gear />
                </IconButton>
              </Box>
              :
              <IconButton onClick={() => { setSelected(3); navigate(getPath(3)) }} sx={{ width: "max-content", color: theme.palette.mode === 'light' ? "#000" : theme.palette.text.primary }}>
                <Gear />
              </IconButton>
            }
          </Stack>
        </Stack>
        
        <Stack spacing={2} alignItems="center">
          {/* Toggle switch without a visible label */}
          <Switch 
            onChange={onToggleMode} 
            checked={theme.palette.mode === 'dark'} 
            sx={{ alignSelf: 'flex-start' }} // Align the switch to the start
          />
          <IconButton onClick={handleSignOut} sx={{ width: "max-content", color: theme.palette.mode === 'light' ? "#000" : theme.palette.text.primary }}>
            <SignOut /> {/* Sign out icon */}
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SideBar
