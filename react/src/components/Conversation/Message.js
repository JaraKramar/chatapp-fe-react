import { Box, Stack } from '@mui/material'
import React from 'react';
import { TextMsgUser, TextMsgAssistant, TimeLine } from './MsgTypes';

const Message = ({key, menu, messages}) => {
  console.log(messages)
  return (
    <Box p={3}>
        <Stack spacing={3} >
            {messages.map((el)=>{
                switch (el.role) {
                    case 'divider':
                      return <TimeLine el={el}/>
                        
                    case 'assistant':
                      return <TextMsgAssistant el={el} menu={menu}/>

                    case "user":
                        return <TextMsgUser el={el} menu={menu}/>

                        // switch (el.subtype) {
                        //     case 'img':
                        //       return <MediaMsg el={el} menu={menu}/>
                        //     case 'doc':
                        //         return <DocMsg el={el} menu={menu}/>
                                
                        //     case 'link':
                        //         return <LinkMsg el={el} menu={menu}/>
                        //     case 'reply':
                        //         return <ReplyMsg el={el} menu={menu}/>
                        
                        //     default:
                        //        return <TextMsg el={el} menu={menu}/>
                        // }
                
                    default:
                      return <></>;
                }
            })}
        </Stack>
    </Box>
  )
}

export default Message