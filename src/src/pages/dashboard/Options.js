import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { updateModel } from "../../redux/slices/app";
import { model_options } from "../../data";
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const Options = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const selectedModel = useSelector((state) => state.app.model);

  const handleModelChange = (event) => {
    const { name } = event.target;
    if (selectedModel.includes(name)) {
      // If already selected, remove it
      dispatch(updateModel(selectedModel.filter((model) => model !== name)));
    } else {
      if (selectedModel.length >= 2) {
        const updatedModels = [...selectedModel.slice(1), name];
        dispatch(updateModel(updatedModels));
      } else {
        // If not selected, add it
        dispatch(updateModel([...selectedModel, name]));
      }
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: 300,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FAFF"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
      }}
    >
      <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">Settings</Typography>
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
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {option.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    {option.desc}
                  </Typography>
                </Box>
              }
              sx={{
                wordBreak: "break-word", // Breaks long words into multiple lines
                overflowWrap: "break-word", // Ensures proper wrapping in older browsers
                whiteSpace: "pre-wrap",
                marginBottom: 2,
              }}
            />
          ))}
        </FormControl>
      </Stack>
    </Box>
  );
};

export default Options;
