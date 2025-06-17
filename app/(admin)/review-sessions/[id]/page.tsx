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
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <p className="text-red-500 text-lg sm:text-xl text-center">
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
    <div className="flex flex-col px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#389f38e3]">
          Session Review
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Started at: {new Date(created_at).toLocaleString()}
        </p>
      </div>

      {/* Session Info Box */}
      <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3">Session Info</h2>
        <div className="space-y-1 text-sm sm:text-base">
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

      {/* Messages */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Messages
      </h2>

      <div className="border max-w-[300px] sm:max-w-2xl  border-gray-100 rounded-lg shadow-sm bg-white p-3 sm:p-4 overflow-hidden">
        <div className="w-full">
          <Messages messages={messages} chatBotName={chatbotName} />
        </div>
      </div>
    </div>
  );
}

export default ReviewSession;
