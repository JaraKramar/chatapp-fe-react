import React from "react";
import Chats from "./Chats";
import { Stack } from "@mui/material";
import FullConversation from "./FullConversation";

const GeneralApp = () => {
  return (
    <Stack direction="row" sx={{ width: "100%" }}>
      <Chats />
      <FullConversation />
    </Stack>
  );
};

export default GeneralApp;
