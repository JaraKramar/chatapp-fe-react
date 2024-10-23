import React, { useEffect, useRef } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import {
  addChatSession,
  setActiveSession,
  removeChatSession,
} from "../../redux/slices/app";
import ChatElement from "../../components/ChatElement";
import fetchPingRAGResponse from "../../services/api_pingrag";
import { generateSessionId } from "../../utils/uuidv4";

const Chats = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null); // Create a ref for the scroll container

  const models = useSelector((state) => state.app.model);
  // console.log(models)

  const allChatIds = useSelector((state) => state.app.allChatIds || []); // Ensure it defaults to an empty array
  const activeChatId = useSelector((state) => state.app.activeChatId); // Get the current active session

  const handleNewChat = () => {
    // Generate a single chatId value
    const chatId = generateSessionId();

    const newSession = {
      chatId: chatId, // Same chatId
      modelName: models,
    };

    for (const key in models) {
      newSession[models[key]] = {
        conversationId: generateSessionId(),
        modelName: models[key],
        messages: [],
        references: [],
        dotstatus: false,
      };
    }
    // Dispatch both sessions
    dispatch(addChatSession(newSession));

    // new chat == active chat
    handleChatClick(newSession.chatId);

    // checkout backend status for model
    for (const key in models) {
      fetchPingRAGResponse(models[key], newSession.chatId, dispatch);
    }
  };

  const handleChatClick = (chatId) => {
    dispatch(setActiveSession(chatId)); // Set the clicked chat as the active session
  };

  const handleRemoveChat = (chatId) => {
    dispatch(removeChatSession(chatId)); // Remove the chat session
  };

  // Effect to scroll to the top when allChatIds change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0; // Scroll to the top
    }
  }, [allChatIds]); // Run the effect whenever allChatIds change

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
        <Stack spacing={1} width="100%">
          <Typography variant="h5">Chats</Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNewChat}
          >
            New Chat
          </Button>
        </Stack>

        <Stack spacing={2.4}>
          <Typography variant="subtitle2" sx={{ color: "#676767" }}>
            All Chats
          </Typography>
        </Stack>

        {/* Scrollable container with hidden scrollbar */}
        <Stack
          className="scrollbar"
          spacing={2}
          direction="column"
          ref={scrollContainerRef}
          sx={{
            flexGrow: 1,
            overflowY: "scroll", // Enable scrolling
            // Hide the scrollbar
            "&::-webkit-scrollbar": {
              display: "none", // For Chrome, Safari, and Edge
            },
            "-ms-overflow-style": "none", // For Internet Explorer and Edge
            "scrollbar-width": "none", // For Firefox
          }}
        >
          <Stack spacing={2.4}>
            {allChatIds.length > 0 ? (
              allChatIds
                .slice()
                .reverse()
                .map((el) => (
                  <ChatElement
                    {...el}
                    key={el.chatId}
                    onClick={() => handleChatClick(el.chatId)}
                    isActive={el.chatId === activeChatId}
                    onRemove={() => handleRemoveChat(el.chatId)}
                  />
                ))
            ) : (
              <Typography variant="body2" sx={{ color: "#676767" }}>
                No chats available.
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Chats;
