import client from "@/graphQl/apolloClient";
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from "@/graphQl/mutations/mutations";
import { GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/graphQl/queries/queries";

async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  try {
    // console.log("🔄 Starting new chat...");

    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: {
        name: guestName,
        email: guestEmail,
        created_at: new Date().toISOString(),
      },
    });

    const guestId = guestResult.data?.insertGuests?.id;
    // console.log("✅ Guest created:", guestId);
    if (!guestId) throw new Error("❌ Guest creation failed");

    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        guest_id: guestId,
        chatbot_id: chatbotId,
        created_at: new Date().toISOString(),
      },
    });

    const chatSessionId = chatSessionResult.data?.insertChat_sessions?.id;
    // console.log("✅ Chat session created:", chatSessionId);
    if (!chatSessionId) throw new Error("❌ Chat session creation failed");

    // const welcomeText = `Welcome ${guestName}!\nHow can I assist you today?`;

    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        sender: "ai",
        content: `Welcome ${guestName}!\nHow can I assist you today?`,
        created_at: new Date().toISOString(), // ✅ THIS IS REQUIRED
      },
      refetchQueries: [
        {
          query: GET_MESSAGES_BY_CHAT_SESSION_ID,
          variables: { chat_session_id: chatSessionId },
        },
      ],
      awaitRefetchQueries: true,
    });

    return chatSessionId;
  } catch (error) {
    console.error("❌ Error in startNewChat:", error);
    throw error;
  }
}

export default startNewChat;
