"use client";

import { Chatbot } from "@/types/types";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Avatar from "./Avatar";
import Link from "next/link";
import ReactTimeago from "react-timeago";

const ChatBotSessions = ({ chatbots }: { chatbots: Chatbot[] }) => {
  //   console.log("[ChatBotSessions] Props:", chatbots);

  const [sortedChatbots, setSortedChatbots] = useState<Chatbot[]>(chatbots);

  useEffect(() => {
    const sortedArray = [...chatbots].sort(
      (a, b) => b.chat_sessions.length - a.chat_sessions.length
    );
    // console.log("[ChatBotSessions] Sorted chatbots:", sortedArray);
    setSortedChatbots(sortedArray);
  }, [chatbots]);

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <Accordion type="single" collapsible>
        {sortedChatbots.map((chatbot) => {
          // console.log(`[ChatBotSessions] Chatbot: ${chatbot.name}`);
          const hasSessions = chatbot.chat_sessions.length > 0;

          return (
            <AccordionItem
              className="rounded-xl border shadow-md mb-4 overflow-hidden"
              value={`item${chatbot.id}`}
              key={chatbot.id}
            >
              <AccordionTrigger className="flex-col sm:flex-row sm:px-6 sm:py-4 px-4 py-3 bg-[#389f38e3] hover:bg-[#389f38] text-white font-semibold transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center w-full">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <Avatar
                      seed={chatbot.name}
                      className="h-10 w-10 mr-3 sm:mr-4"
                    />
                    <p className="text-lg sm:text-xl">{chatbot.name}</p>
                  </div>
                  <div className="sm:ml-auto">
                    <span className="text-xs sm:text-sm bg-white text-[#389f38] px-3 py-1 rounded-full font-medium">
                      {chatbot.chat_sessions.length}{" "}
                      {chatbot.chat_sessions.length === 1
                        ? "session"
                        : "sessions"}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="bg-gray-50 px-4 sm:px-6 py-5 space-y-4">
                {hasSessions ? (
                  chatbot.chat_sessions.map((session) => {
                    // console.log(`[ChatBotSessions] Session:`);
                    // console.log("Session ID:", session.id);

                    return (
                      <Link
                        href={`/review-sessions/${session.id}`}
                        key={session.id}
                        className="block border border-[#389f38e3] bg-white hover:shadow-md rounded-lg p-4 sm:p-5 relative transition-all"
                      >
                        <p className="text-base capitalize font-medium text-gray-800">
                          {session.guests?.name || "Guest"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.guests?.email || "No email provided"}
                        </p>
                        <p className="absolute top-3 right-4 text-xs text-gray-500">
                          <ReactTimeago date={new Date(session.created_at)} />
                        </p>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-sm italic text-gray-500">
                    No sessions found for this chatbot.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default ChatBotSessions;
