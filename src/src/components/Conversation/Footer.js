import { Box, IconButton, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { PaperPlaneTilt } from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { addMessageToSession } from "../../redux/slices/app";
import { useDispatch } from "react-redux";
import fetchRAGResponse from "../../services/api_rag";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

const ChatInput = ({
  setOpenPicker,
  inputValue,
  onInputChange,
  onSendMessage,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
      // Only send message if Enter is pressed without Shift
      e.preventDefault(); // Prevent newline in the TextField
      onSendMessage(inputValue);
    }
  };

  return (
    <StyledInput
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      value={inputValue}
      onChange={onInputChange}
      onKeyDown={handleKeyDown} // Listen for Enter key press using onKeyDown
      InputProps={{
        disableUnderline: true,
      }}
    />
  );
};
const Footer = ({ activeChatId, model, messages }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openPicker, setOpenPicker] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State for the input value

  // console.log(messages)

  const sendMessage = async (content) => {
    if (content.trim() && activeChatId) {
      // console.log(model)
      // Add user message to the session
      dispatch(
        addMessageToSession({
          model: model,
          sessionId: activeChatId,
          message: { role: "user", content: content },
          references: "USER_REFERENCE",
        })
      );
      setInputValue(""); // Clear input after sending

      try {
        if (model.length >= 2) {
          // If the model is "haiku and sonnet", make two requests simultaneously
          const [
            {
              assistantMessage: assistantMessage1,
              formatedContext: formatedContext1,
            },
            {
              assistantMessage: assistantMessage2,
              formatedContext: formatedContext2,
            },
          ] = await Promise.all([
            fetchRAGResponse(
              model[0],
              content,
              activeChatId,
              messages[model[0]].messages,
              dispatch
            ),
            fetchRAGResponse(
              model[1],
              content,
              activeChatId,
              messages[model[1]].messages,
              dispatch
            ),
          ]);

          // Add both assistant messages to the session
          dispatch(
            addMessageToSession({
              model: model[0],
              sessionId: activeChatId,
              message: assistantMessage1, // Response from the first model
              references: formatedContext1,
            })
          );
          dispatch(
            addMessageToSession({
              model: model[1],
              sessionId: activeChatId,
              message: assistantMessage2, // Response from the second model
              references: formatedContext2,
            })
          );
        } else {
          // Normal flow: single request to the model
          const { assistantMessage, formatedContext } = await fetchRAGResponse(
            model[0],
            content,
            activeChatId,
            messages[model[0]].messages,
            dispatch
          );

          dispatch(
            addMessageToSession({
              model: model[0],
              sessionId: activeChatId,
              message: assistantMessage, // The response from the API
              references: formatedContext,
            })
          );
        }
      } catch (error) {
        console.error("Failed to fetch assistant message:", error);
        // Handle error here, e.g., dispatch an error message to the chat
      }
    }
  };
  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FAFF"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
      }}
    >
      <Stack direction="row" alignItems={"center"} spacing={3}>
        <Stack sx={{ width: "100%" }}>
          {/* Chat Input */}
          <Box
            sx={{
              display: openPicker ? "inline" : "none",
              zIndex: 10,
              position: "fixed",
              bottom: 81,
              right: 100,
            }}
          >
            <Picker
              theme={theme.palette.mode}
              data={data}
              onEmojiSelect={console.log}
            />
          </Box>
          <ChatInput
            setOpenPicker={setOpenPicker}
            inputValue={inputValue}
            onInputChange={(e) => setInputValue(e.target.value)} // Update inputValue on change
            onSendMessage={sendMessage} // Pass sendMessage function to ChatInput
          />
        </Stack>
        <Box
          sx={{
            height: 48,
            width: 48,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1.5,
          }}
        >
          <Stack
            sx={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton onClick={() => sendMessage(inputValue)}>
              {" "}
              {/* Send inputValue */}
              <PaperPlaneTilt color="#fff" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
export default Footer;
