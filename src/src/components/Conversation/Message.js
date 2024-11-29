import { Box, Stack } from "@mui/material";
import React from "react";
import {
  TextMsgUser,
  TextMsgAssistant,
  TimeLine,
  LoadingDots,
} from "./MsgTypes";
import { LOADING_MSG_STATUS } from "../../config";
// import { useSelector, useDispatch } from 'react-redux';

const Message = ({ key, menu, chat_data }) => {
  // console.log(chat_data)
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {chat_data.messages.map((el, index) => {
          console.log(el)
          // bug is on next line
          switch (el.role) {
            case "divider":
              return <TimeLine el={el} />;

            case "assistant":
              if (el.content === LOADING_MSG_STATUS) {
                return <LoadingDots key={index} />;
              }
              return (
                <TextMsgAssistant
                  key={index}
                  el={el}
                  references={chat_data.references[index]}
                  menu={menu}
                />
              );

            case "user":
              return <TextMsgUser key={index} el={el} menu={menu} />;

            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};

export default Message;
