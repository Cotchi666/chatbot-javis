import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import options2Fill from '@iconify/icons-eva/options-2-fill';
// material
import {
  Button,
  Box,
  Backdrop,
  Paper,
  Tooltip,
  Divider,
  Typography,
  Stack,
  IconButton
} from '@mui/material';
//
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';

import Fab from '@mui/material/Fab';
import ClearIcon from '@mui/icons-material/Clear';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import React from 'react';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';
import Scrollbar from 'components/Scrollbar';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 260;

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

  return (
    <>
      <Box
        sx={{
          top: 12,
          bottom: 12,
          right: 0,
          position: 'fixed',
          zIndex: 2001,
          ...(open && { right: 12 })
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
            borderRadius: '24px 0 16px 24px'
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
            {/*  */}
            <Scrollbar
              sx={{
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
                <Stack
                  display="-webkit-inline-box"
                  sx={{
                    pt: '35px',
                    width: '480px',
                    height: 'auto'
                  }}
                >
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                    sx={{ mr: '9px', ml: '-10px' }}
                  />{' '}
                  <Typography>
                    Hello content here Hello content hereHello content hereHello content hereHello
                    content hereHello content hereHello content hereHello content hereHello content
                    hereHello content hereHello content hereHello content hereHello content here
                  </Typography>
                </Stack>
                {/* user chat */}
                <Stack
                  display="-webkit-inline-box"
                  sx={{
                    pt: '35px',
                    width: '480px',
                    height: 'auto',
                    pl: '126px'
                  }}
                >
                  <Typography>
                    <Typography
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        p: '12px 27px',
                        borderRadius: '13px'
                      }}
                    >
                      Hello content here Hello content hereHello content hereHello content hereHello
                      content hereHello content hereHello content hereHello content hereHello
                      content hereHello content hereHello content hereHello content hereHello
                      content here
                    </Typography>
                  </Typography>
                </Stack>

                <Stack
                  display="-webkit-inline-box"
                  sx={{
                    pt: '35px',
                    width: '480px',
                    height: 'auto'
                  }}
                >
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                    sx={{ mr: '9px', ml: '-10px' }}
                  />{' '}
                  <Typography>
                    Hello content here Hello content hereHello content hereHello content hereHello
                    content hereHello content hereHello content hereHello content hereHello content
                    hereHello content hereHello content hereHello content hereHello content here
                  </Typography>
                </Stack>
              </Stack>
            </Scrollbar>

            {/*  */}

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
