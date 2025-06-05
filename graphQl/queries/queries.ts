import { gql } from "@apollo/client";

// queries.ts
export const GET_CHATBOTS_LIST = gql`
  query GetChatbots {
    chatbotsList {
      id
      name
      created_at
      chatbot_characteristics {
        id
        content
        created_at
      }
    }
  }
`;

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

// export const GET_CHATBOT_BY_ID = gql`
//   query GetChatbotById($id: Int!) {
//     chatbots(id: $id) {
//       id
//       name
//       created_at
//       chatbot_characteristics {
//         id
//         content
//         created_at
//       }
//       chat_sessions {
//         id
//         created_at
//         guest_id
//         messages {
//           id
//           content
//           created_at
//         }
//       }
//     }
//   }
// `;

// export const GET_CHATBOT_BY_ID = gql`
//   query GetChatbotById($id: Int!) {
//     chatbots(id: $id) {
//       id
//       name
//       created_at
//       chatbot_characteristics {
//         id
//         content
//         created_at
//       }
//       chat_sessions {
//         id
//         created_at
//         guest_id
//         messages {
//           id
//           content
//           created_at
//         }
//       }
//     }
//   }
// `;
