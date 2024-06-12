import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { TextField, Avatar, Box, Fab, Typography, Stack, IconButton, Button } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import SendIcon from '@mui/icons-material/Send';
import Scrollbar from 'components/Scrollbar';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { getAllMessages, createMessage, getChatCompletion } from 'contexts/apis';
import ArrowUpwardTwoToneIcon from '@mui/icons-material/ArrowUpwardTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  const [openAIKeyInput, setOpenAIKeyInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [isOpen, setIsOpen] = useState(false);
  const conversationId = '6621dec4146fbe6b65d6cbe6';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };
  const handleOpenAIKeyInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenAIKeyInput(event.target.value);
  };
  const handleInputSend = async () => {
    if (!input.trim()) return;
    if (!window.localStorage.getItem('accessToken')) {
      setError(true);
      return;
    }
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

      const response = await createMessage(input, conversationId);

      const responseData = {
        id: response.data.data.createMessage._id,
        message: response.data.data.createMessage.message,
        chatBotMessage: response.data.data.createMessage.chatBotMessage
      };

      if (responseData.chatBotMessage === '') {
        const chatbotMessage: ChatMessage = {
          id: responseData.id, // Generate a unique ID for the user message
          avatarUrl: '', // You can set the user's avatar URL here
          message: responseData.message,
          chatBotMessage: "Please, send me your 'open-ai-key'." // Assuming this property is not applicable for user messages
        };

        setChatData([...chatData, chatbotMessage]);
      } else {
        const chatbotMessage: ChatMessage = {
          id: responseData.id, // Generate a unique ID for the user message
          avatarUrl: '', // You can set the user's avatar URL here
          message: responseData.message,
          chatBotMessage: responseData.chatBotMessage // Assuming this property is not applicable for user messages
        };

        setChatData([...chatData, chatbotMessage]);
      }
    } catch (error) {
      setError(true);
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
  const toggleChatbot = () => {

    setIsOpen(!isOpen);
  };
  const setOpenOpenAiKeyPopup = () => {
    setOpenDialog(!openDialog);
  };
  const checkOpenAIKey = async () => {
    if (!openAIKeyInput.trim()) return;
    setOpenAIKeyInput('');
    const check = await getChatCompletion(openAIKeyInput);
    if (check !== false) {
      window.localStorage.setItem('openAIKey', openAIKeyInput);
      await getAllMessagesFromBackend();
      setOpenOpenAiKeyPopup();
      setError(false);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    } else {
      setOpenOpenAiKeyPopup();
      setError(true);
    }
    window.location.reload();

  };
  const getAllMessagesFromBackend = async () => {

    if (!window.localStorage.getItem('accessToken')) {
      setError(true);
      return;
    }
    const result = await checkOpenAIKeyInStorage();
    if (result === false) {
      setChatData([]);
      setError(true);
      setDataLoading(false);
      return;
    }
    setDataLoading(true);
    const res = await getAllMessages(conversationId);

    if (res.data.errors) {
      if (res.data.errors[0].message) {
        setError(true);
      }
    } else {
      setError(false);
    }

    // Check if res.data.data is null or undefined
    if (!res.data.data) {
      // If null or undefined, set chatData to an empty array
      setChatData([]);
      setDataLoading(false);
      return;
    }

    // Check if res.data.data.messages is null or undefined
    const messages = res.data.data.messages;
    if (!messages) {
      // If null or undefined, set chatData to an empty array
      setChatData([]);
      setDataLoading(false);
      return;
    }

    // Set chatData to the received messages
    setChatData(messages);
    setDataLoading(false);
  };
  const checkOpenAIKeyInStorage = async () => {
    let apiEnvKey = process.env.OPEN_AI_KEY ?? ''
    let apiKey = window.localStorage.getItem('openAIKey') ?? apiEnvKey;
    return true

    // const check = await getChatCompletion(apiKey);

    // if (check !== false) {
    //   return true;
    // } else {
    //   return false;
    // }
  };

  useEffect(() => {
    getAllMessagesFromBackend();
  }, []);
  useEffect(() => {
    // when fetch all message
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    // when fetch a message
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
      {openDialog && (
        <Dialog
          sx={{
            zIndex: 2002,
            '& .css-1i4c58h-MuiPaper-root-MuiDialog-paper': {
              width: '1000px'
            }
          }}
          fullScreen={fullScreen}
          open={openDialog}
          onClose={setOpenOpenAiKeyPopup}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle sx={{ paddingBottom: '18px' }} id="responsive-dialog-title">
            {'OpenAIKey in below: '}
          </DialogTitle>
          <DialogContent>
            <TextField
              value={openAIKeyInput}
              onChange={handleOpenAIKeyInputChange}
              id="filled-basic"
              label="Filled"
              variant="filled"
              sx={{
                '& .css-1r1hrxa-MuiInputBase-root-MuiFilledInput-root': {
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                  width: '502px'
                },
                '& .css-ukvdse-MuiFormLabel-root-MuiInputLabel-root ': {
                  display: 'none'
                }
                // '& .css-1r1hrxa-MuiInputBase-root-MuiFilledInput-root': {
                //   width: '502px'
                //  }
                //  ,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={setOpenOpenAiKeyPopup}>
              Cancel
            </Button>
            <Button onClick={checkOpenAIKey} autoFocus>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {dataLoading === false && <Box
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
          <Fab color="primary" aria-describedby={id} onClick={toggleChatbot}>
            <SmartToyOutlinedIcon />
          </Fab>
        </Box>
      </Box>}

      {isOpen && (
        <Stack
          sx={{
            top: 12,
            bottom: '656px',
            right: '542px',
            position: 'fixed',
            zIndex: 2001,
            ...(open && { right: 12 })
          }}
        >
          <Stack
            sx={{
              borderRadius: '2px',
              boxShadow: '1px 2px 7px 4px',
              backgroundColor: 'white',
              p: 0.5,
              px: '4px',
              mt: -3,
              left: -87,
              top: '95%',
              color: 'grey.800',
              position: 'absolute'
            }}
          >
            <Stack direction="row" justifyContent="space-between" sx={{ zIndex: 10 }}>
              <Typography
                sx={{ width: '500px', p: '9px', height: '33px', color: theme.palette.primary.main }}
                variant="h4"
              >
                <Typography
                  sx={{
                    lineHeight: 0.5,
                    fontSize: '23px',
                    fontWeight: 1000,
                    fontFamily: 'fantasy',
                    display: 'revert',
                    paddingTop: '10px'
                  }}
                >
                  JAVIS
                </Typography>
              </Typography>

              <IconButton
                aria-label="fingerprint"
                onClick={toggleChatbot}
                sx={{ height: '40px', alignItems: 'flex-start' }}
              >
                <RemoveOutlinedIcon />
              </IconButton>
            </Stack>

            <Scrollbar
              scrollableNodeProps={{ ref: scrollRef }}
              sx={{
                bottom: '24px',
                height: '500px',
                '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': { height: 0 }
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
                {dataLoading === false ? (
                  chatData.map((message, id) => (
                    <ChatMessage key={id} chatMessage={message} loading={loading} />
                  ))
                ) : (
                  <>
                    <Skeleton sx={{ width: 500, height: 100 }} />
                    <Skeleton animation="wave" sx={{ width: 500, height: 100 }} />
                    <Skeleton animation="wave" sx={{ width: 500, height: 100 }} />
                    <Skeleton animation="wave" sx={{ width: 500, height: 100 }} />

                    <Skeleton animation="wave" sx={{ width: 500, height: 100 }} />

                    <Skeleton animation={false} sx={{ width: 500 }} />
                  </>
                )}
                <div ref={chatContainerRef}></div>
              </Stack>
            </Scrollbar>
            {error ? (
              <Alert
                severity="error"
                sx={{
                  '& .css-yszjc6-MuiButtonBase-root-MuiIconButton-root ': {
                    color: 'white',
                    padding: '3px',
                    paddingBottom: '-15px',
                    paddingTop: '16px',
                    paddingRight: '15px',
                    marginLeft: '-14px'
                  },
                  '& .css-1savncu-MuiButtonBase-root-MuiIconButton-root': {
                    marginTop: '23px'
                  }
                }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenOpenAiKeyPopup();
                    }}
                  >
                    <VpnKeyTwoToneIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {/* <AlertTitle> Error</AlertTitle>
                Sign in as Demo user. Click the key icon to provide your OpenAI API key.
              </Alert> */}
               <AlertTitle> Error</AlertTitle>
                Please login as Demo user.
              </Alert>
            ) : (
              <TextField
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '2px' },
                  '& .MuiOutlinedInput-input': {
                    color: '#999393'
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
            )}
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

  const { chatBotMessage, message } = chatMessage;
  return (
    <>
      {' '}
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
            display: chatBotMessage ? '-webkit-inline-box' : 'flex'
          }}
        >
          {chatBotMessage && (
            <Box
              sx={{
                mr: '9px',
                ml: '-10px',
                height: '43px',
                p: '10px',
                borderRadius: '34px',
                backgroundColor: theme.palette.primary.main,
                boxShadow: '0px 0px 4px 0px'
              }}
            >
              <SmartToyOutlinedIcon sx={{ color: theme.palette.primary.light }} />
            </Box>
          )}
          <Typography
            sx={{
              backgroundColor: chatBotMessage ? 'transparent' : 'primary.main',
              p: chatBotMessage ? '0px 47px 0px 6px' : '12px 27px',
              borderRadius: chatBotMessage ? ' ' : '13px',
              alignContent: 'space-around'
            }}
          >
            {chatBotMessage}
          </Typography>
        </Stack>
      </div>
    </>
  );
});
