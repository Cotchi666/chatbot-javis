import axios from "axios";

export const createMessage = async (messageText: string, conversationId: string) => {
    const body = {
      query: `
      mutation 
      ($createChatBotMessageInput: CreateChatBotMessageInput!)  {
        createChatBotMessage(createChatBotMessageInput: $createChatBotMessageInput) {
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
        createChatBotMessageInput: {
            messageText: messageText,
            conversationId: conversationId
        }
      }
    };
    
    let config = {
        headers: {
          'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRlbW8xMjNAZ21haWwuY29tIiwic3ViIjoiNjYxYTY3NWMyYTM2YTYyZmY5M2JmOWMzIiwiaWF0IjoxNzEzNDk1NTk1LCJleHAiOjE3MTM1ODE5OTV9.Hz_wevi7J_Y7mqAoHQAXgfUdvx26NKMDHcs6wyuqGi0'
        }
      }
    const url = 'http://localhost:8000/graphql'; // Replace with your GraphQL endpoint URL

    const response = await axios.post(url, body, config);
    return response

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
          'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRlbW8xMjNAZ21haWwuY29tIiwic3ViIjoiNjYxYTY3NWMyYTM2YTYyZmY5M2JmOWMzIiwiaWF0IjoxNzEzNDk1NTk1LCJleHAiOjE3MTM1ODE5OTV9.Hz_wevi7J_Y7mqAoHQAXgfUdvx26NKMDHcs6wyuqGi0'
        }
      }
    const domainBackend = process.env.REACT_APP_BACKEND_HOST
      ? process.env.REACT_APP_BACKEND_HOST
      : ' ';
    const response = await axios.post(domainBackend, body,config);

    return response
  };