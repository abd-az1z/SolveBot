import ChatBotSessions from "@/components/ChatBotSessions";
import { GET_ALL_CHATBOTS } from "@/graphQl/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { Chatbot, GetChatbotsByUserData } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export default async function ReviewSessionsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  
  const response = await serverClient.query<GetChatbotsByUserData>({
    query: GET_ALL_CHATBOTS,
    fetchPolicy: "no-cache",
  });

  const allChatbots = response.data?.chatbotsList ?? [];

  const chatbotsByUser = allChatbots.filter(
    (bot) => bot.clerk_user_id === userId
  );

  const sortedChatbotsByUser: Chatbot[] = chatbotsByUser.map((bot) => ({
    ...bot,
    chat_sessions: [...bot.chat_sessions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
  }));

  return (
    <div className="flex-1 bg-white shadow-xl rounded-2xl p-6 sm:p-10 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-[#389f38e3] mb-3">
        Chat Sessions
      </h1>
      <p className="text-sm text-gray-600 italic mb-6">
        Review all your chatbot sessions and guest conversations below.
      </p>
      <ChatBotSessions chatbots={sortedChatbotsByUser} />
    </div>
  );
}