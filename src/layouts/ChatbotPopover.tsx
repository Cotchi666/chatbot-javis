import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import options2Fill from '@iconify/icons-eva/options-2-fill';
// material
import { Button, Box, Backdrop, Paper, Tooltip, Divider, Typography, Stack } from '@mui/material';
//
import Fab from '@mui/material/Fab';

import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 260;

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [open]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      />

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
            borderRadius: '24px 0 16px 24px',
          }}
        >
         <Fab color="primary" aria-label="add">
        <SmartToyOutlinedIcon />
      </Fab>
        </Box>

       
      </Box>
    </>
  );
}
