"use client";

import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GetChatbotByIdResponse,
  Message,
  MessagesByChatSessionIdResponse,
  MessagesByChatSessionIdVariables,
} from "@/types/types";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import startNewChat from "@/lib/startNewChat";
import Avatar from "@/components/Avatar";
import { useQuery } from "@apollo/client";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphQl/queries/queries";
import Messages from "@/components/Messages";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";

const formSchema = z.object({
  message: z.string().min(2, "Your message is too short"),
});

function ChatbotPage() {
  const params = useParams();
  const id = params?.id as string;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [chatId, setChatId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: chatbotData } = useQuery<GetChatbotByIdResponse>(
    GET_CHATBOT_BY_ID,
    {
      variables: { id },
    }
  );

  const { data, refetch } = useQuery<
    MessagesByChatSessionIdResponse,
    MessagesByChatSessionIdVariables
  >(GET_MESSAGES_BY_CHAT_SESSION_ID, {
    variables: { chat_session_id: chatId },
    skip: !chatId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (chatId) refetch();
  }, [chatId]);

  useEffect(() => {
    if (data?.chat_sessions?.messages?.length) {
      setMessages(data.chat_sessions.messages);
    } else {
      console.warn("⚠️ No messages found for this session.");
    }
  }, [data]);

  const handleInformationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    const newChatId = await startNewChat(name, email, Number(id));
    if (newChatId) {
      setChatId(newChatId);
      setIsOpen(false);
    }
    setLoading(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { message: formMessage } = values;
    form.reset();

    if (!name || !email) {
      setIsOpen(true);
      setLoading(false);
      return;
    }

    const trimmedMessage = formMessage.trim();
    if (!trimmedMessage) return;

    const userMessage: Message = {
      id: Date.now(),
      content: trimmedMessage,
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "user",
    };

    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: "Thinking...",
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "ai",
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          chat_session_id: chatId,
          chatbot_id: id,
          content: trimmedMessage,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server error:", text);
        throw new Error("Failed to send message");
      }

      const result = await response.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: result.content, id: result.id }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#f7f9fc] flex items-center justify-center px-4">
      {/* Initial user info dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-lg border border-[#389f38]/30">
          <form onSubmit={handleInformationSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#389f38]">
                Let's help you out
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Just need a few details to assist you better
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 py-4 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-[#389f38] hover:bg-[#2f842f] text-white font-semibold"
                disabled={!name || !email || loading}
              >
                {!loading ? "Continue" : "Loading..."}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Chat layout */}
      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl mt-10 border border-[#389f38]/20 overflow-hidden h-[80vh] sm:h-[85vh]">
        {/* Sticky Header */}
        <div className="flex items-center gap-4 px-6 py-4 bg-[#f0fdf4] border-b border-[#389f38]/30 sticky top-0 z-50">
          <Avatar
            seed={chatbotData?.chatbots?.name}
            className="w-12 h-12 bg-white rounded-full border-2 border-[#389f38]"
          />
          <div>
            <h1 className="text-xl font-bold text-[#389f38] truncate">
              {chatbotData?.chatbots.name}
            </h1>
            <p className="text-xs text-gray-500">Typically replies instantly</p>
          </div>
        </div>

        {/* Scrollable Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          {messages.length > 0 ? (
            <Messages
              messages={messages}
              chatbotName={chatbotData?.chatbots.name}
            />
          ) : (
            <p className="text-center text-sm text-gray-400 italic">
              No messages yet. Start the conversation above.
            </p>
          )}
        </div>

        {/* Sticky Message Input */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center p-2 border-t bg-white z-10"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel hidden>Message</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#389f38] transition"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="ml-2 px-6 py-2 bg-[#389f38] hover:bg-[#2f7e2f] text-white text-sm font-semibold rounded-lg transition-all"
            >
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ChatbotPage;