"use client";

import { Message } from "@/types/types";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { UserCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";

function Messages({
  messages,
  chatBotName,
}: {
  messages: Message[];
  chatBotName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const isReviewsPage = path.includes("review-sessions");

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="space-y-4 p-4 sm:p-6 lg:p-8 border-[#389f38] bg-slate-100 border-2 rounded-2xl shadow-xl  ">
      {messages.map((message) => {
        const isChatbot = message.sender === "ai";

        return (
          <div
            key={message.id}
            className={`chat ${isChatbot ? "chat-start" : "chat-end"}`}
          >
            <div
              className={`flex items-end py-2 gap-2 w-full max-w-4xl mx-auto ${
                isChatbot ? "justify-start" : "justify-end"
              }`}
            >
              {isChatbot && (
                <div className="chat-image avatar self-end">
                  <div className="w-10 rounded-full">
                    <Avatar seed={chatBotName} />
                  </div>
                </div>
              )}

              <div className="flex flex-col items-start max-w-[80%]">
                <div
                  className={`chat-bubble relative whitespace-pre-wrap break-words ${
                    isChatbot
                      ? "chat-bubble-primary bg-blue-500 text-white rounded-2xl py-2 px-3 rounded-bl-none"
                      : "chat-bubble-secondary bg-gray-200 rounded-2xl py-2 px-3 rounded-br-none"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc list-inside ml-5 mb-5"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal list-inside ml-5 mb-5"
                          {...props}
                        />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1 className="text-2xl font-bold mb-5" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-xl font-bold mb-5" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-lg font-bold mb-5" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <table
                          className="table-auto w-full border-separate border-2 rounded-sm border-gray-200 mb-5"
                          {...props}
                        />
                      ),
                      th: ({ node, ...props }) => (
                        <th className="text-left underline" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          className={`whitespace-break-spaces mb-5 ${
                            message.content === "Thinking..."
                              ? "animate-pulse"
                              : ""
                          } ${isChatbot ? "text-white" : "text-gray-700"}`}
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          className="font-bold underline hover:text-blue-400"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                  {isReviewsPage && (
                    <span
                      className={`text-[0.65rem] mt-1 block opacity-70 ${
                        isChatbot ? "text-left" : "text-right"
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>

              {!isChatbot && (
                <div className="chat-image avatar self-end">
                  <div className="w-10 h-10">
                    <UserCircle className="text-gray-300 w-full h-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div ref={ref}></div>
    </div>
  );
}

export default Messages;

