import { gql } from "@apollo/client";

export const GET_CHATBOT_BY_ID = gql`
  query GetChatbotById($id: Int!) {
    chatbots(id: $id) {
      id
      name
      created_at
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        id
        created_at
        guest_id
        messages {
          id
          content
          created_at
        }
      }
    }
  }
`;

// View chatbots & review chatbots
export const GET_ALL_CHATBOTS = gql`
  query GetAllChatbots {
    chatbotsList {
      id
      name
      clerk_user_id
      created_at
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        id
        created_at
        guest_id
        messages {
          id
          content
          created_at
        }
        guests {
          name
          email
        }
      }
    }
  }
`;

export const GET_USER_CHATBOTS = gql`
  query GetUserChatbots($userId: String!) {
    chatbotsByUser(clerk_user_id: $userId) {
      id
      name
      chat_sessions {
        id
        created_at
        guest {
          name
          email
        }
      }
    }
  }
`;


// OG
// export const GET_CHAT_SESSION_MESSAGES = gql`
//   query GetChatSessionMessages($id: Int!) {
//     chat_sessions(id: $id) {
//       id
//       created_at
//       guest {
//         name
//         email
//       }
//       messages {
//         id
//         content
//         created_at
//         sender
//       }
//       chatbots {
//         name
//       }
//     }
//   }
// `;


export const GET_CHAT_SESSION_MESSAGES = gql`
  query GetChatSessionMessages($id: Int!) {
    chat_sessions(id: $id) {
      id
      created_at
      guests {
        name
        email
      }
      messages {
        id
        content
        created_at
        sender
      }
      chatbots {
        name
      }
    }
  }
`;