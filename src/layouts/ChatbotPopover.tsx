import React, { useState, useEffect } from 'react';
// material
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';
import { Popover, TextField, Avatar, Box, Fab, Typography, Stack, IconButton } from '@mui/material';
//
import Scrollbar from 'components/Scrollbar';

// ----------------------------------------------------------------------
const chatData = [
  ,
  {
    id:1,
    isBot: true,
    avatarUrl: '/static/images/avatar/1.jpg',
    message:
      'Hello content here Hello content hereHello content hereHello content hereHello  content hereHello content hereHello content hereHello content hereHello content  hereHello content hereHello content hereHello content hereHello content here '
  },
  {
    id:2,
    isBot: false,
    avatarUrl: '/static/images/avatar/1.jpg',
    message:
      'Hello iam a human '
  },
  {id:3,
    isBot: true,
    avatarUrl: '/static/images/avatar/1.jpg',
    message:
      'Hello content here Hello content hereHello content hereHello content hereHello  content hereHello content hereHello content hereHello content hereHello content  hereHello content hereHello content hereHello content hereHello content here '
  },
  ,
  {
    id:4,
    isBot: false,
    avatarUrl: '/static/images/avatar/1.jpg',
    message:
      'Hello iam a human '
  },
  {id:5,
    isBot: true,
    avatarUrl: '/static/images/avatar/1.jpg',
    message:
      'Hello content here Hello content hereHello content hereHello content hereHello  content hereHello content hereHello content hereHello content hereHello content  hereHello content hereHello content hereHello content hereHello content here '
  }
  ,
  {id:5,
    isBot: false,
    avatarUrl: '/static/images/avatar/1.jpg',
    message:
      'Hello content here Hello content hereHello content hereHello content hereHello  content hereHello content hereHello content hereHello content hereHello content  hereHello content hereHello content hereHello content hereHello content here '
  }
];

export default function Chatbot() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget);
    if (anchorEl == null) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {});
  return (
    <>
      <Box
        sx={{
          top: 12,
          bottom: 12,
          right: 0,
          position: 'fixed',
          zIndex: 2001,
          ...(open && { right: 12 }),
         
        }}
      >
        <Box
               

          sx={{
            p: 0.5,
            px: '4px',
            mt: -3,
            left: -87,
            top: '95%',
            color: 'grey.800',
            position: 'absolute',
            borderRadius: '24px 0 16px 24px',
          }}
        >
          <Fab color="primary" aria-describedby={id} onClick={handleClick}>
            <SmartToyOutlinedIcon />
          </Fab>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
          >
            {/*  */}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ backgroundColor: theme.palette.primary.main }}
            >
              <Typography sx={{ width: '500px', p: '9px', height: '33px' }} variant="h6">
                <SmartToyOutlinedIcon />
              </Typography>
              <IconButton
                aria-label="fingerprint"
                onClick={handleClose}
                sx={{ height: '40px', alignItems: 'flex-start' }}
              >
                <RemoveOutlinedIcon />
              </IconButton>
            </Stack>
            {/* <Divider  /> */}
            {/* --------------------- Message ------------------------- */}
            <Scrollbar
              sx={{
                bottom: '24px',
                height:'500px',
                '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
                  height: 0
                }
              }}
            >
              <Stack
                
                sx={{
                  
                
                  width: '450px',
                  height: '450px',
                  top: 12,
                  bottom: 12,
                  right: 0,
                  p: 3,
                  pt: 0.5
                }}
                direction="column"
                justifyContent="space-between"
                alignItems="start"
                display="flow"
              >
               {chatData.map((message, id) => (
                  <ChatMessage key={id} message={message} />
                ))}
              </Stack>
            </Scrollbar>

              {/* --------------------- Input ------------------------- */}
            <TextField
              fullWidth
              placeholder="Type your message..."
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton color="primary">
                    <SendIcon />
                  </IconButton>
                )
              }}
              sx={{ p: 0.5 }}
            />
          </Popover>
        </Box>
      </Box>
    </>
  );
}

function ChatMessage({ message }) {
  const { isBot, avatarUrl, message: content , id} = message;

  return (  message &&  (
    <Stack
    
      display="-webkit-inline-box"
      sx={{
        pt: '35px',
        width: isBot ? '480px': '497px',
        height: 'auto',
        pl: isBot ? '0px' : '105px' ,
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
            borderRadius: isBot ? ' ' :'13px'
          }}
        >
          {content}
        </Typography>
    </Stack>
  ))
  
  
}