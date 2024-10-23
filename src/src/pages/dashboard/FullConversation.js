import React from "react";
import { Box, Typography } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { prepareMessages } from "../../utils/prepareMessages";
import { getActiveChat } from "../../utils/getActiveChat";

const FullConversation = () => {
  const theme = useTheme();
  const { sidebar } = useSelector((store) => store.app);

  const { activeChatId, allChatIds, activeChat } = getActiveChat(useSelector);
  const messages = prepareMessages(activeChat);

  console.log(activeChat);
  // console.log(messages)

  return (
    <Box
      sx={{
        height: "100%",
        width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F0F4FA"
            : theme.palette.background.default,
        flexGrow: 1, // Allow it to grow to fill the remaining space
        flexShrink: 0, // Prevent shrinking when other elements stretch
        flexBasis: "auto", // Set the base size to auto
      }}
    >
      {/* Conditional rendering based on activeChatId */}
      {allChatIds.some((session) => session.chatId === activeChatId) ? (
        <Conversation
          activeChatId={activeChatId}
          activeChat={activeChat}
          messages={messages}
          models={activeChat ? activeChat.modelName : ""}
        />
      ) : (
        <Box sx={{ textAlign: "center", padding: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No active conversation selected.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please select a chat or start a new conversation.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FullConversation;
