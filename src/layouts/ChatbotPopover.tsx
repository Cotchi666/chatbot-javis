import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { TextField, Avatar, Box, Fab, Typography, Stack, IconButton } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import SendIcon from '@mui/icons-material/Send';
import Scrollbar from 'components/Scrollbar';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Skeleton from '@mui/material/Skeleton';

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
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

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
    setLoading(true);
    try {
      const userMessage: ChatMessage = {
        id: Date.now(), // Generate a unique ID for the user message
        avatarUrl: '', // You can set the user's avatar URL here
        message: input,
        chatBotMessage: 'waiting ...' // Assuming this property is not applicable for user messages
      };

      // Add the user's message to the chatData
      setChatData([...chatData, userMessage]);

      const response = await createMessage(input, "6621dec4146fbe6b65d6cbe6");
      const responseData = {
        id: response.data.data.createMessage._id,
        message: response.data.data.createMessage.message,
        chatBotMessage: response.data.data.createMessage.chatBotMessage
      };


      const chatbotMessage: ChatMessage = {
        id: responseData.id, // Generate a unique ID for the user message
        avatarUrl: '', // You can set the user's avatar URL here
        message: responseData.message,
        chatBotMessage: responseData.chatBotMessage // Assuming this property is not applicable for user messages
      };

      setChatData([...chatData, chatbotMessage]);

    } catch (error) {
      console.error('Error fetching response from backend:', error);
    } finally {
      setLoading(false);
      setInput(''); // Clear input field
    }
  };



  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleInputSend();
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const getAllMessagesFromBackend = async () => {
    setDataLoading(true)
    const res = await getAllMessages("6621dec4146fbe6b65d6cbe6");

    // Check if res.data.data is null or undefined
    if (!res.data.data) {
      // If null or undefined, set chatData to an empty array
      setChatData([]);
      setDataLoading(false)
      return;
    }

    // Check if res.data.data.messages is null or undefined
    const messages = res.data.data.messages;
    if (!messages) {
      // If null or undefined, set chatData to an empty array
      setChatData([]);
      setDataLoading(false)
      return;
    }

    // Set chatData to the received messages
    setChatData(messages);
    setDataLoading(false)
  };
  useEffect(() => { getAllMessagesFromBackend() }, [])
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
          <Stack sx={{ borderRadius: '2px', boxShadow: '1px 2px 7px 4px', backgroundColor: 'white', p: 0.5, px: '4px', mt: -3, left: -87, top: '95%', color: 'grey.800', position: 'absolute' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ zIndex: 10 }}>
              <Typography sx={{ width: '500px', p: '9px', height: '33px', color: theme.palette.primary.main }} variant="h4">
                <Typography sx={{
                  lineHeight: 0.5,
                  fontSize: '23px',
                  fontWeight: 1000,
                  fontFamily: 'fantasy',
                  display: 'revert',
                  paddingTop: '10px',

                }}>JAVIS</Typography>

              </Typography>

              <IconButton aria-label="fingerprint" onClick={toggleChatbot} sx={{ height: '40px', alignItems: 'flex-start' }}>
                <RemoveOutlinedIcon />
              </IconButton>
            </Stack>
            <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ bottom: '24px', height: '500px', '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': { height: 0 } }}>
              <Stack
                sx={{ width: '450px', height: '450px', top: 12, bottom: 12, right: 0, p: 3, pt: 0.5 }} direction="column" justifyContent="space-between" alignItems="start" display="flow">
                {dataLoading === false ? chatData.map((message, id) => (
                  <ChatMessage key={id} chatMessage={message} loading={loading} />
                )) : <>
                  <Skeleton sx={{ width: 500, height: 100 }} />
                  <Skeleton animation="wave" sx={{ width: 500, height: 100 }} />
                  <Skeleton animation="wave" sx={{ width: 500, height: 100 }} />
                  <Skeleton animation="wave" sx={{ width: 500, height: 100 }} />

                  <Skeleton animation="wave" sx={{ width: 500, height: 100 }} />

                  <Skeleton animation={false} sx={{ width: 500 }}/></>}
                <div ref={chatContainerRef}></div>
              </Stack>
            </Scrollbar>
            <TextField
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '2px' }, '& .MuiOutlinedInput-input': {
                  color: "#999393"
                }
              }}
              disabled={loading} // Disable TextField when input is null or empty
              fullWidth
              placeholder="Message Javis..."
              variant="outlined"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton color="primary" onClick={handleInputSend}>
                    <SendRoundedIcon />
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
interface ChatMessageProps {
  chatMessage: {
    id: number;
    chatBotMessage: string;
    message: string;
  };
  loading: boolean; // Define the loading prop
}
const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(({ chatMessage }, ref) => {
  if (!chatMessage) return null; // Handle undefined message
  const theme = useTheme();

  const { id, chatBotMessage, message } = chatMessage
  const avatarUrl = " "
  return (

    <> <div ref={ref}>
      <Stack
        display="-webkit-inline-box"
        sx={{
          pt: '35px',
          width: '497px',
          height: 'auto',
          pl: '105px',
          alignItems: 'end',
          display: 'flex',
          zIndex: 10
        }}
      >

        <Typography
          sx={{
            backgroundColor: 'primary.main',
            p: '12px 27px',
            borderRadius: '4px'
          }}
        >
          {message}
        </Typography>
      </Stack>
      <Stack
        display="-webkit-inline-box"
        sx={{
          zIndex: 10,
          pt: '35px',
          width: chatBotMessage ? '480px' : '497px',
          height: 'auto',
          pl: chatBotMessage ? '0px' : '105px',
          pb: '8px',
          alignItems: chatBotMessage ? 'start' : 'end',
          display: chatBotMessage ? '-webkit-inline-box' : 'flex',
        }}
      >
        {chatBotMessage && (
          <Box sx={{
            mr: '9px',
            ml: '-10px',
            height: '43px',
            p: '10px',
            borderRadius: '34px',
            backgroundColor: theme.palette.primary.main,
            boxShadow: '0px 0px 4px 0px'
          }}>
            <SmartToyOutlinedIcon sx={{ color: theme.palette.primary.light }} />
          </Box>
        )}
        <Typography
          sx={{
            backgroundColor: chatBotMessage ? 'transparent' : 'primary.main',
            p: chatBotMessage ? '0px 47px 0px 6px' : '12px 27px',
            borderRadius: chatBotMessage ? ' ' : '13px',
            alignContent: 'space-around',

          }}
        >
          {chatBotMessage}
        </Typography>
      </Stack>
    </div>
    </>
  );
});
