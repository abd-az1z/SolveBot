import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatbot(
    $clerk_user_id: String!
    $name: String!
    $created_at: DateTime!
  ) {
    insertChatbots(
      clerk_user_id: $clerk_user_id
      name: $name
      created_at: $created_at
    ) {
      id
      name
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatbot($id: Int!) {
    deleteChatbots(id: $id) {
      id
    }
  }
`;

export const UPDATE_CHATBOT = gql`
  mutation UpdateChatbot($id: Int!, $name: String!) {
    updateChatbots(id: $id, name: $name) {
      id
      name
      created_at
    }
  }
`;

export const ADD_CHARACTERISTIC = gql`
  mutation AddCharacteristic(
    $chatbotId: Int!
    $content: String!
    $created_at: DateTime!
  ) {
    insertChatbot_characteristics(
      chatbot_id: $chatbotId
      content: $content
      created_at: $created_at
    ) {
      id
      content
      created_at
    }
  }
`;

export const REMOVE_CHARACTERISTIC = gql`
  mutation RemoveCharacteristic($characteristicId: Int!) {
    deleteChatbot_characteristics(id: $characteristicId) {
      id
    }
  }
`;

export const UPDATE_CHARACTERISTIC = gql`
  mutation UpdateCharacteristic($id: Int!, $content: String!) {
    updateChatbot_characteristics(id: $id, content: $content) {
      id
      content
    }
  }
`;

// OG
// export const INSERT_MESSAGE = gql`
//   mutation InsertMessage(
//     $chat_session_id: Int!
//     $content: String!
//     $sender: String!
//   ) {
//     insertMessages(
//       chat_session_id: $chat_session_id
//       content: $content
//       sender: $sender
//     ) {
//       id
//       content
//       created_at
//       sender
//     }
//   }
// `;
export const INSERT_MESSAGE = gql`
  mutation InsertMessage(
    $chat_session_id: Int!
    $content: String!
    $sender: String!
    $created_at: DateTime!
  ) {
    insertMessages(
      chat_session_id: $chat_session_id
      content: $content
      sender: $sender
      created_at: $created_at
    ) {
      id
      content
      sender
      created_at
    }
  }
`;

// OG
// export const INSERT_GUEST = gql`
//   mutation insertGuest($name: String!, $email: String!) {
//     insertGuests(name: $name, email: $email) {
//       id
//     }
//   }
// `;

export const INSERT_GUEST = gql`
  mutation insertGuest($name: String, $email: String, $created_at: DateTime!) {
    insertGuests(name: $name, email: $email, created_at: $created_at) {
      id
    }
  }
`;

// OG
// export const INSERT_CHAT_SESSION = gql`
//   mutation insertChatSessions($chatbot_id: Int!, $guest_id: Int!) {
//     insertChat_Sessions(chatbot_id: $chatbot_id, guest_id: $guest_id) {
//       id
//     }
//   }
// `;

export const INSERT_CHAT_SESSION = gql`
  mutation insertChatSessions(
    $chatbot_id: Int!
    $guest_id: Int!
    $created_at: DateTime!
  ) {
    insertChat_sessions(
      chatbot_id: $chatbot_id
      guest_id: $guest_id
      created_at: $created_at
    ) {
      id
    }
  }
`;
