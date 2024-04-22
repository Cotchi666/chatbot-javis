import axios from "axios";
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRlbW8xMjNAZ21haWwuY29tIiwic3ViIjoiNjYxYTY3NWMyYTM2YTYyZmY5M2JmOWMzIiwiaWF0IjoxNzEzNzczNzcyLCJleHAiOjE3MTM4NjAxNzJ9.CGBSD_IuRICZwsxkbCL6tffQsBh5PcECL2rFfcZEifQ"
export const createMessage = async (messageText: string, conversationId: string) => {
  console.log(messageText)
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
          'Authorization': 'Bearer ' + accessToken
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
          'Authorization': 'Bearer ' + accessToken
        }
      }
    const domainBackend = process.env.REACT_APP_BACKEND_HOST
      ? process.env.REACT_APP_BACKEND_HOST
      : ' ';
    const response = await axios.post(domainBackend, body,config);

    return response
  };