import axios from 'axios';
const accessToken = window.localStorage.getItem('accessToken') ?? '';
const openAIKey = window.localStorage.getItem('openAIKey') ?? '';
const backendHost = process.env.REACT_APP_BACKEND_HOST ?? 'http://localhost:8000/graphql';

export const createMessage = async (messageText: string, conversationId: string) => {

  const body = {
    query: `
      mutation 
      ($createMessageInput: CreateMessageInput!)  {
        createMessage(createMessageInput: $createMessageInput) {
               id,
                message,
                chatBotMessage,
                messageStatus,
                senderId: ,
                conversationId,
                createdAt,
                updatedAt,
                deletedAt
          }
      }
  `,
    variables: {
      createMessageInput: {
        messageText: messageText,
        conversationId: conversationId
      }
    }
  };

  let config = {
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    params: {
      openAIKey: openAIKey
    }
  };

  const response = await axios.post(backendHost, body, config);
  return response;
};
export const updateAccessChatbot = async (openAIKey: string) => {
  const body = {
    query: `
    mutation 
    ($openAIKey: String!)  {
      updateAccessChatbot(openAIKey: $openAIKey) 
    }
`,
    variables: {
      openAIKey: openAIKey
    }
  };

  let config = {
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    params: {
      openAIKey: openAIKey
    }
  };
  const url = 'http://localhost:8000/graphql'; // Replace with your GraphQL endpoint URL

  const response = await axios.post(url, body, config);
  return response;
};
export const getAllMessages = async (conversationID: string) => {
  const body = {
    query: `query ($conversationID: String!) {
        messages(conversationID: $conversationID) {
            id, message, chatBotMessage
      }
    }`,
    variables: {
      conversationID: conversationID
    }
  };
  let config = {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  };
  const response = await axios.post(backendHost, body, config);

  return response;
};
export const getChatCompletion = async (openAIKey: string) => {
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: 'Hello!'
      }
    ]
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAIKey}`
      }
    });

    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Error');
    return false;
  }
};
