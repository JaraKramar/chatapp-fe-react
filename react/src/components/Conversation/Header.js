import { Avatar, Box, Typography, Stack } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import StyledBadge from "../StyledBadge";

const Header = ({ models, activeChat }) => {
  const theme = useTheme();
  // Get the first letter of the models
  let firstLetterBig = [];
  let dotStatus = [];
  for (const key in models) {
    firstLetterBig[key] = models[key][0].toUpperCase() + models[key].slice(1);
    dotStatus[key] = activeChat[models[key]].dotstatus;
  }

  return (
    <Box
      p={2}
      sx={{
        display: "flex",
        alignItems: "center",
        height: "70px",
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FAFF"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
      }}
    >
      {/* Check models for rendering headers */}
      {models.length >= 2 ? (
        <>
          {/* First header for Haiku */}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
              color={dotStatus[0] === true ? "#44B700" : "grey"}
              animate={dotStatus[0] === true ? "true" : "false"}
            >
              <Avatar alt={models[0]} sx={{ color: "black" }}>
                {firstLetterBig[0][0]}
              </Avatar>
            </StyledBadge>
            <Stack spacing={0.2} sx={{ marginLeft: 1 }}>
              <Typography variant="subtitle2">{firstLetterBig[0]}</Typography>
              <Typography variant="caption">
                {dotStatus[0] === true ? "Online" : "Offline"}
              </Typography>
            </Stack>
          </Box>

          {/* Vertical separator */}
          <Box
            sx={{
              width: "2px", // Width of the vertical line
              backgroundColor: theme.palette.divider, // Use a color from the theme
              height: "50px", // Set height based on avatar size
              marginLeft: 2,
              marginRight: 2,
            }}
          />

          {/* Second header for Sonnet */}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
              color={dotStatus[1] === true ? "#44B700" : "grey"}
              animate={dotStatus[1] === true ? "true" : "false"}
            >
              <Avatar alt={models[1]} sx={{ color: "black" }}>
                {firstLetterBig[1][0]}
              </Avatar>
            </StyledBadge>
            <Stack spacing={0.2} sx={{ marginLeft: 1 }}>
              <Typography variant="subtitle2">{firstLetterBig[1]}</Typography>
              <Typography variant="caption">
                {dotStatus[1] === true ? "Online" : "Offline"}
              </Typography>
            </Stack>
          </Box>
        </>
      ) : (
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
            color={dotStatus[0] === true ? "#44B700" : "grey"}
            animate={dotStatus[0] === true ? "true" : "false"}
          >
            <Avatar alt={models[0]} sx={{ color: "black" }}>
              {firstLetterBig[0][0]}{" "}
              {/* Show first letter of the models name */}
            </Avatar>
          </StyledBadge>
          <Stack spacing={0.2} sx={{ marginLeft: 1 }}>
            <Typography variant="subtitle2">{firstLetterBig[0]}</Typography>
            <Typography variant="caption">
              {dotStatus[0] === true ? "Online" : "Offline"}
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Header;
