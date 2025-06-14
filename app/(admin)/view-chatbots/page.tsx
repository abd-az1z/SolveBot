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
    <div className="w-full overflow-x-hidden">
      <div className="flex-1 bg-white shadow-xl rounded-2xl p-6 sm:p-10 w-full max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#389f38] mb-6">
          Active Chatbots
        </h1>

        {sortedChatbots.length === 0 ? (
          <div className="mb-3">
            <p className="text-sm text-gray-700 italic mb-5">
              No chatbots found. Create your first chatbot to start engaging
              users in meaningful conversations.
            </p>
            <Link href="/create-chatbot">
              <Button className=" bg-[#389f38e3] hover:bg-[#389f38] text-white font-medium rounded-lg transition duration-200">
                Create Chatbot
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-700 italic mb-5">
              Manage your chatbots or create new ones to expand your support
              capabilities.
            </p>

            <ul className="flex flex-col space-y-6">
              {sortedChatbots.map((chatbot) => (
                <li
                  key={chatbot.id}
                  className="p-5 rounded-xl bg-gray-50 border border-[#389f38]/30 hover:shadow-lg transition duration-200"
                >
                  <Link
                    href={`/edit-chatbot/${chatbot.id}`}
                    className="block w-full"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                        <Avatar seed={chatbot.name} />
                        <h2 className="text-lg font-semibold capitalize text-gray-800 break-words">
                          {chatbot.name}
                        </h2>
                      </div>
                      <p className="text-sm text-gray-500 break-words">
                        Created:{" "}
                        {new Date(chatbot.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Characteristics */}
                    {/* Characteristics */}
                    <hr className="my-4 border-gray-200" />
                    <div>
                      <h4 className="italic text-sm font-medium mb-2 text-gray-700">
                        Characteristics:
                      </h4>
                      {chatbot.chatbot_characteristics?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {chatbot.chatbot_characteristics.map((char) => (
                            <span
                              key={char.id}
                              className="bg-[#389f38]/10 text-[#389f38] text-xs sm:text-sm px-3 py-1 rounded-full border border-[#389f38]/30 max-w-full break-words"
                            >
                              {char.content}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          No characteristics added yet.
                        </p>
                      )}
                    </div>

                    {/* Chat Session */}
                    <hr className="my-4 border-gray-200" />
                    <div>
                      <h4 className="italic text-sm font-medium mb-1 text-gray-700">
                        Chat Sessions: {chatbot.chat_sessions?.length ?? 0}
                      </h4>
                      <ul className="list-inside text-sm text-gray-600 space-y-1">
                        {chatbot.chat_sessions.map((session) => (
                          <li key={session.id}>
                            <strong>Started:</strong>{" "}
                            {new Date(session.created_at).toLocaleDateString()}
                            <br />
                            <strong>Messages:</strong> {session.messages.length}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewChatbots;
