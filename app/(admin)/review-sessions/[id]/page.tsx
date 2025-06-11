import Messages from "@/components/Messages";
import { GET_CHAT_SESSION_MESSAGES } from "@/graphQl/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  GetChatSessionMessagesResponse,
  GetChatSessionMessagesVariables,
} from "@/types/types";

export const dynamic = "force-dynamic";

async function ReviewSession({ params: { id } }: { params: { id: string } }) {
  const sessionIdNumber = parseInt(id);

  // if (isNaN(sessionIdNumber)) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <p className="text-red-500 text-xl">Invalid session ID format.</p>
  //     </div>
  //   );
  // }

  const response = await serverClient.query<
    GetChatSessionMessagesResponse,
    GetChatSessionMessagesVariables
  >({
    query: GET_CHAT_SESSION_MESSAGES,
    variables: { id: sessionIdNumber },
  });

  if (response.errors || !response.data?.chat_sessions) {
    console.error("GraphQL Error:", response.errors);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">
          {response.errors ? "Error loading session." : "Session not found."}
        </p>
      </div>
    );
  }

  const {
    id: chatSessionId,
    created_at,
    messages,
    chatbots: { name: chatbotName },
    guests: { name: guestName, email: guestEmail },
  } = response.data.chat_sessions;

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-10 bg-white max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#389f38e3]">Session Review</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Started at: {new Date(created_at).toLocaleString()}
        </p>
      </div>

      <div className="bg-gray-50 p-5 rounded-lg border mb-8">
        <h2 className="text-lg font-semibold mb-2">Session Info</h2>
        <div className="space-y-1">
          <p>
            <span className="font-medium text-gray-700">Chatbot:</span>{" "}
            <span className="text-gray-900">{chatbotName}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Guest:</span>{" "}
            <span className="text-gray-900">
              {guestName || "Guest"} ({guestEmail || "No email"})
            </span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Messages</h2>

      <Messages messages={messages} chatBotName={chatbotName} />


      {/* <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`w-fit max-w-md p-4 rounded-lg shadow-sm text-sm ${
              message.sender === "ai"
                ? "bg-green-100 text-green-800 self-start rounded-bl-none"
                : "bg-blue-100 text-blue-800 self-end rounded-br-none ml-auto"
            }`}
          >
            <p className="font-semibold capitalize mb-1">{message.sender}:</p>
            <p>{message.content}</p>
            <p className="text-xs text-gray-500 text-right mt-1">
              {new Date(message.created_at).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default ReviewSession;