import { Stack } from "@mui/material";
import React from "react";
import Options from "./Options";
import FullConversation from "./FullConversation";

const Settings = () => {
  return (
    <Stack direction="row" sx={{ width: "100%" }}>
      <Options />
      <FullConversation />
    </Stack>
  );
};
export default Settings;
