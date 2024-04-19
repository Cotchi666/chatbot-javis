import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { TextField, Avatar, Box, Fab, Typography, Stack, IconButton } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import SendIcon from '@mui/icons-material/Send';
import Scrollbar from 'components/Scrollbar';

import { getAllMessages, createMessage } from 'contexts/apis';
interface ChatMessage {
  id: number;
  chatBotMessage: string;
  avatarUrl: string;
  message: string;
}


export default function Chatbot() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const theme = useTheme();
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleInputSend = async () => {
    if (!input.trim()) return;
    setInput('');
    try {
      const response = await createMessage(input, "6621dec4146fbe6b65d6cbe6")

      console.log(response.data.data.createChatBotMessage)

      const responseData = {
        message: response.data.data.createChatBotMessage.message,
        chatBotMessage: response.data.data.createChatBotMessage.chatBotMessage
      }

      const botMessage: ChatMessage = {
        id: chatData.length + 2,
        avatarUrl: '/static/images/avatar/bot.jpg',
        message: responseData.message,
        chatBotMessage: responseData.chatBotMessage
      };
      console.log("first",botMessage)

      setChatData(prevChatData => [...prevChatData, botMessage]);
    } catch (error) {
      console.error('Error fetching response from backend:', error);
    }
  };


  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleInputSend();
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    console.log(isOpen)
    setIsOpen(!isOpen);
  };

  const getAllMessagesFromBackend = async ()=>{
    const res = await getAllMessages("6621dec4146fbe6b65d6cbe6")
    console.log(res.data.data.messages)
    setChatData(res.data.data.messages)
  };
  useEffect(() => {getAllMessagesFromBackend()},[])
  useEffect(() => {
    
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    const scrollMessagesToBottomMessage = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
    scrollMessagesToBottomMessage();
  }, [isOpen, chatData]);


  return (

    <>
      <Box sx={{ top: 12, bottom: 12, right: 0, position: 'fixed', zIndex: 2001, ...(open && { right: 12 }) }}>
        <Box sx={{ p: 0.5, px: '4px', mt: -3, left: -87, top: '95%', color: 'grey.800', position: 'absolute', borderRadius: '24px 0 16px 24px' }}>
          <Fab color="primary" aria-describedby={id} onClick={toggleChatbot}>
            <SmartToyOutlinedIcon />
          </Fab>


        </Box>
      </Box>
      {isOpen && (

        <Stack sx={{ top: 12, bottom: '656px', right: '542px', position: 'fixed', zIndex: 2001, ...(open && { right: 12 }) }}>
          <Stack sx={{ borderRadius: '2px', outline: 'solid', backgroundColor: 'white', p: 0.5, px: '4px', mt: -3, left: -87, top: '95%', color: 'grey.800', position: 'absolute' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ backgroundColor: theme.palette.primary.main }}>
              <Typography sx={{ width: '500px', p: '9px', height: '33px' }} variant="h6">
                <SmartToyOutlinedIcon />
              </Typography>
              <IconButton aria-label="fingerprint" onClick={handleClose} sx={{ height: '40px', alignItems: 'flex-start' }}>
                <RemoveOutlinedIcon />
              </IconButton>
            </Stack>
            <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ bottom: '24px', height: '500px', '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': { height: 0 } }}>
              <Stack
                sx={{ width: '450px', height: '450px', top: 12, bottom: 12, right: 0, p: 3, pt: 0.5 }} direction="column" justifyContent="space-between" alignItems="start" display="flow">
                {chatData.map((message, id) => (
                  <ChatMessage key={id} chatMessage={message} />
                ))}
                <div ref={chatContainerRef}></div>
              </Stack>
            </Scrollbar>
            <TextField

              fullWidth
              placeholder="Type your message..."
              variant="outlined"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton color="primary" onClick={handleInputSend}>
                    <SendIcon />
                  </IconButton>
                )
              }}
            />
          </Stack>
        </Stack>

      )}
    </>
  );

}
const ChatMessage = React.forwardRef<HTMLDivElement, { chatMessage: ChatMessage }>(({ chatMessage }, ref) => {
  if (!chatMessage) return null; // Handle undefined message

  const {id, chatBotMessage, message } = chatMessage
  const avatarUrl = " "
  return (
    <div ref={ref}>
      <Stack
        display="-webkit-inline-box"
        sx={{
          pt: '35px',
          width: '497px',
          height: 'auto',
          pl: '105px',
          alignItems: 'end',
          display: 'flex',
        }}
      >
      
        <Typography
          sx={{
            backgroundColor: 'primary.main',
            p: '12px 27px',
            borderRadius: '13px'
          }}
        >
          {message}
        </Typography>
      </Stack>
      <Stack
        display="-webkit-inline-box"
        sx={{
          pt: '35px',
          width: chatBotMessage ? '480px' : '497px',
          height: 'auto',
          pl: chatBotMessage ? '0px' : '105px',
          alignItems: chatBotMessage ? 'start' : 'end',
          display: chatBotMessage ? '-webkit-inline-box' : 'flex',
        }}
      >
        {chatBotMessage && (
          <Avatar alt="Bot" src={avatarUrl} sx={{ mr: '9px', ml: '-10px' }} />
        )}
        <Typography
          sx={{
            backgroundColor: chatBotMessage ? 'transparent' : 'primary.main',
            p: chatBotMessage ? '0px 0px' : '12px 27px',
            borderRadius: chatBotMessage ? ' ' : '13px'
          }}
        >
          {chatBotMessage}
        </Typography>
      </Stack>
      
    </div>
  );
});

// const ChatMessage = React.forwardRef<HTMLDivElement, { message: ChatMessage }>(({ message }, ref) => {
//   if (!message) return null; // Handle undefined message

//   const { isBot, avatarUrl, message: content } = message;

//   return (
//     <div ref={ref}>
//       <Stack
//         display="-webkit-inline-box"
//         sx={{
//           pt: '35px',
//           width: isBot ? '480px' : '497px',
//           height: 'auto',
//           pl: isBot ? '0px' : '105px',
//           alignItems: isBot ? 'start' : 'end',
//           display: isBot ? '-webkit-inline-box' : 'flex',
//         }}
//       >
//         {isBot && (
//           <Avatar alt="Bot" src={avatarUrl} sx={{ mr: '9px', ml: '-10px' }} />
//         )}
//         <Typography
//           sx={{
//             backgroundColor: isBot ? 'transparent' : 'primary.main',
//             p: isBot ? '0px 0px' : '12px 27px',
//             borderRadius: isBot ? ' ' : '13px'
//           }}
//         >
//           {content}
//         </Typography>
//       </Stack>
//     </div>
//   );
// });
