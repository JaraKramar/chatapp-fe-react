import React from "react";
import { Box, Divider, IconButton, Stack, Switch } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SignOut } from "phosphor-react"; // Import SignOut icon
import { Nav_Buttons } from "../../data";
import useSettings from "../../hooks/useSettings";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/Images/csob_logo.png";
import {
  setSignoutStatus,
  updateSidebarSelected,
} from "../../redux/slices/app";

import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const selected = useSelector((state) => state.app.sidebar.selected);
  const { onToggleMode } = useSettings();

  const handleSelected = (selected) => {
    dispatch(updateSidebarSelected(selected));
  };

  const handleSignOut = () => {
    console.log("Sign out");
    dispatch(setSignoutStatus(true));
  };

  return (
    <Box
      p={2}
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        height: "100vh",
        width: 100,
        display: "flex",
      }}
    >
      <Stack
        direction="column"
        alignItems={"center"}
        justifyContent="space-between"
        sx={{ width: "100%", height: "100%" }}
        spacing={3}
      >
        <Stack alignItems={"center"} spacing={4}>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              height: 64,
              width: 64,
              borderRadius: 1.5,
            }}
          >
            <img src={Logo} alt={"Logo icon"} />
          </Box>
          <Stack
            sx={{ width: "max-content" }}
            direction="column"
            alignItems="center"
            spacing={3}
          >
            {Nav_Buttons.map((el, index) => (
              <React.Fragment key={el.index}>
                {el.index === selected ? (
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 1.5,
                    }}
                  >
                    <IconButton sx={{ width: "max-content", color: "#fff" }}>
                      {el.icon}
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton
                    onClick={() => {
                      handleSelected(el.index);
                      navigate(el.path);
                    }}
                    sx={{
                      width: "max-content",
                      color:
                        theme.palette.mode === "light"
                          ? "#000"
                          : theme.palette.text.primary,
                    }}
                  >
                    {el.icon}
                  </IconButton>
                )}
                {index < Nav_Buttons.length - 1 && (
                  <Divider sx={{ width: "48px" }} />
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Stack>

        <Stack spacing={2} alignItems="center">
          {/* Toggle switch without a visible label */}
          <Switch
            onChange={onToggleMode}
            checked={theme.palette.mode === "dark"}
            sx={{ alignSelf: "flex-start" }} // Align the switch to the start
          />
          <IconButton
            onClick={handleSignOut}
            sx={{
              width: "max-content",
              color:
                theme.palette.mode === "light"
                  ? "#000"
                  : theme.palette.text.primary,
            }}
          >
            <SignOut /> {/* Sign out icon */}
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SideBar;
