import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Popover, TextField, Avatar, Box, Fab, Typography, Stack, IconButton } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import SendIcon from '@mui/icons-material/Send';
import Scrollbar from 'components/Scrollbar';
import { chatData } from 'utils/mock-data/chat';

interface ChatMessage {
  id: number;
  isBot: boolean;
  avatarUrl: string;
  message: string;
}

const initialChatData = chatData as ChatMessage[];

export default function Chatbot() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const theme = useTheme();
  const [chatData, setChatData] = useState<ChatMessage[]>(initialChatData);
  const [input, setInput] = useState('');
  const lastMessageRef = useRef<HTMLDivElement>(null); // Ref for the last message element

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

  const handleInputSend = () => {
    if (!input.trim()) return;
    const newMessage: ChatMessage = {
      id: chatData.length + 1,
      isBot: false,
      avatarUrl: '/static/images/avatar/1.jpg',
      message: input
    };
    setChatData(prevChatData => [...prevChatData, newMessage]);
    setInput('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleInputSend();
    }
  };

  useEffect(() => {
    // Scroll to the last message when chatData changes
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatData]);

  return (
    <Box sx={{ top: 12, bottom: 12, right: 0, position: 'fixed', zIndex: 2001, ...(open && { right: 12 }) }}>
      <Box sx={{ p: 0.5, px: '4px', mt: -3, left: -87, top: '95%', color: 'grey.800', position: 'absolute', borderRadius: '24px 0 16px 24px' }}>
        <Fab color="primary" aria-describedby={id} onClick={handleClick}>
          <SmartToyOutlinedIcon />
        </Fab>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Stack direction="row" justifyContent="space-between" sx={{ backgroundColor: theme.palette.primary.main }}>
            <Typography sx={{ width: '500px', p: '9px', height: '33px' }} variant="h6">
              <SmartToyOutlinedIcon />
            </Typography>
            <IconButton aria-label="fingerprint" onClick={handleClose} sx={{ height: '40px', alignItems: 'flex-start' }}>
              <RemoveOutlinedIcon />
            </IconButton>
          </Stack>
          <Scrollbar sx={{ bottom: '24px', height: '500px', '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': { height: 0 } }}>
            <Stack sx={{ width: '450px', height: '450px', top: 12, bottom: 12, right: 0, p: 3, pt: 0.5 }} direction="column" justifyContent="space-between" alignItems="start" display="flow">
              {chatData.map((message, id) => (
                <ChatMessage key={id} message={message} ref={chatData.length - 1 === id ? lastMessageRef : null} />
              ))}
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
        </Popover>
      </Box>
    </Box>
  );
}

const ChatMessage = React.forwardRef<HTMLDivElement, { message: ChatMessage }>(({ message }, ref) => {
  if (!message) return null; // Handle undefined message

  const { isBot, avatarUrl, message: content } = message;

  return (
    <div ref={ref}>
      <Stack
        display="-webkit-inline-box"
        sx={{
          pt: '35px',
          width: isBot ? '480px' : '497px',
          height: 'auto',
          pl: isBot ? '0px' : '105px',
          alignItems: isBot ? 'start' : 'end',
          display: isBot ? '-webkit-inline-box' : 'flex',
        }}
      >
        {isBot && (
          <Avatar alt="Bot" src={avatarUrl} sx={{ mr: '9px', ml: '-10px' }} />
        )}
        <Typography
          sx={{
            backgroundColor: isBot ? 'transparent' : 'primary.main',
            p: isBot ? '0px 0px' : '12px 27px',
            borderRadius: isBot ? ' ' : '13px'
          }}
        >
          {content}
        </Typography>
      </Stack>
    </div>
  );
});
