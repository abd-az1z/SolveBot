import { INSERT_MESSAGE } from "@/graphQl/mutations/mutations";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphQl/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotByIdResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();

  if (!content || !chat_session_id || !chatbot_id || !name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  console.log(
    `Received message from session ${chat_session_id}: ${content} {chatbot: ${chatbot_id}}`
  );

  try {
    // Step 1: Get chatbot characteristics
    const { data } = await serverClient.query<GetChatbotByIdResponse>({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
    });

    const chatbot = data.chatbots;
    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    // Step 2: Fetch previous messages
    const { data: messagesData } = await serverClient.query({
      query: GET_MESSAGES_BY_CHAT_SESSION_ID,
      variables: { chat_session_id },
      fetchPolicy: "no-cache",
    });

    const previousMessages = messagesData.chat_sessions.messages || [];

    const formattedPreviousMessages: ChatCompletionMessageParam[] =
      previousMessages.map((message) => ({
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender === "ai" ? "system" : name,
        content: message.content,
      }));

    const systemPrompt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join(" + ");

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        name: "system",
        content: `You are a helpful assistant talking to ${name}. If a generic message is asked that is not relevant to the points mentioned in the key information section, inform the user they are only allowed to ask about specific content. Use emojis where appropriate. Key info: ${systemPrompt}`,
      },
      ...formattedPreviousMessages,
      {
        role: "user",
        name,
        content,
      },
    ];

    // Step 3: OpenAI completion
    // const completion = await openai.chat.completions.create({
    //   messages,
    //   model: "gpt-3.5-turbo",
    // });

    // const aiResponse = completion.choices[0]?.message?.content?.trim();

    // if (!aiResponse) {
    //   return NextResponse.json(
    //     { error: "AI failed to generate a response" },
    //     { status: 500 }
    //   );
    // }
    // Step 3 - Get AI Completion
    const useMock =
      process.env.NODE_ENV === "development" || !process.env.OPENAI_API_KEY;

    let aiResponse: string;

    if (useMock) {
      console.warn("🔧 Development or missing API key: Using mock response.");
      aiResponse = "🤖 [Mock] Hello! This is a development fallback response.";
    } else {
      const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo",
      });

      aiResponse = completion.choices[0]?.message?.content?.trim();

      if (!aiResponse) {
        return NextResponse.json(
          { error: "Failed to generate AI response" },
          { status: 500 }
        );
      }
    }

    // Step 4: Save user message
    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        sender: "user",
        content,
      },
    });

    // Step 5: Save AI message
    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        sender: "ai",
        content: aiResponse,
      },
    });

    // Step 6: Return
    return NextResponse.json({
      id: aiMessageResult.data.insertMessages.id,
      content: aiResponse,
    });
  } catch (error: any) {
    // Specific OpenAI quota error
    if (error?.code === "insufficient_quota") {
      return NextResponse.json(
        {
          error:
            "OpenAI quota exceeded. Please check your plan or billing at https://platform.openai.com/account/usage.",
        },
        { status: 429 }
      );
    }

    console.error("Error in /api/send-message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
