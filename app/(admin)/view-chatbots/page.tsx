import { auth } from "@clerk/nextjs/server";
import { GET_ALL_CHATBOTS } from "@/graphQl/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotsByUserData } from "@/types/types";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ViewChatbots = async () => {
  const { userId } = await auth();
  if (!userId) return;

  const result = await serverClient.query<GetChatbotsByUserData>({
    query: GET_ALL_CHATBOTS,
    fetchPolicy: "no-cache",
  });

  const allChatbots = result?.data?.chatbotsList ?? [];

  const chatbotsByUser = allChatbots.filter(
    (chatbot) => chatbot.clerk_user_id === userId
  );

  const sortedChatbots = [...chatbotsByUser].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex-1 bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full">
      <h1 className="text-xl md:text-2xl font-semibold mb-8">
        Active Chatbots
      </h1>
      {sortedChatbots.length === 0 ? (
        <div className="mb-3">
          <p className="text-sm text-gray-700 italic mb-5">
            No chatbots found. Create your first chatbot to start engaging users
            in meaningful conversations.
          </p>
          <Link href="/create-chatbot">
            <Button className="w-full bg-[#389f38e3] hover:bg-[#389f38] text-white font-medium rounded-lg transition duration-200">
              Create Chatbot
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-700 italic mb-5">
            Here are your existing chatbots. Manage them or create new ones to
            expand your support capabilities.
          </p>
          <ul className="flex flex-col space-y-4">
            {sortedChatbots.map((chatbot) => (
              <Link key={chatbot.id} href={`/edit-chatbot/${chatbot.id}`}>
                <li className="relative p-5 border rounded-md max-w-3xl bg-white hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar seed={chatbot.name} />
                      <h2 className="text-lg font-semibold text-gray-800">
                        {chatbot.name}
                      </h2>
                    </div>
                    <p className="absolute top-5 right-5 text-xs text-gray-500">
                      Created:{" "}
                      {new Date(chatbot.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Characteristics */}
                  <hr className="my-4" />
                  <div>
                    <h4 className="italic text-sm font-medium mb-1">
                      Characteristics:
                    </h4>
                    {chatbot.chatbot_characteristics?.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {chatbot.chatbot_characteristics.map((char) => (
                          <li key={char.id}>{char.content}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No characteristics added yet.
                      </p>
                    )}
                  </div>
                  {/* Chat Session */}
                  <hr className="my-4" />
                  <h4 className="italic text-sm font-medium mb-1">Sessions:</h4>
                  <div className="">
                    <h4 className="italic text-sm font-medium mb-1">
                      Chat Sessions: {chatbot.chat_sessions?.length ?? 0}
                    </h4>
                    <ul className="list-inside text-sm text-gray-600 space-y-1">
                      {chatbot.chat_sessions.map((session) => (
                        <li key={session.id}>
                          Started on:{" "}
                          {new Date(session.created_at).toLocaleDateString()}
                          <br />
                          Messages: {session.messages.length}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewChatbots;
