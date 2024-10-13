import { Box, Stack } from '@mui/material'
import React from 'react';
import { TextMsgUser, TextMsgAssistant, TimeLine, LoadingDots } from './MsgTypes';
import { useSelector, useDispatch } from 'react-redux';

const Message = ({key, menu, messages}) => {
  // console.log(messages)
  return (
    <Box p={3}>
        <Stack spacing={3} >
            {messages.map((el, index)=>{
                switch (el.role) {
                    case 'divider':
                      return <TimeLine el={el}/>
                        
                    case 'assistant':
                      if (el.content === "LOADING_MSG_STATUS") {
                        return <LoadingDots  key={index} />
                      }
                      return <TextMsgAssistant key={index} el={el} menu={menu}/>

                    case "user":
                        return <TextMsgUser key={index} el={el} menu={menu}/>
                
                    default:
                      return <></>;
                }
            })}
        </Stack>
    </Box>
  )
}

export default Message