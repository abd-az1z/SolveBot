import { INSERT_MESSAGE } from "@/graphQl/mutations/mutations";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphQl/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotByIdResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();

  if (!content || !chat_session_id || !chatbot_id || !name) {
    console.error("❌ Missing fields:", {
      content,
      chat_session_id,
      chatbot_id,
      name,
    });
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

//   console.log(
//     `📩 Received message from session ${chat_session_id}: ${content} {chatbot: ${chatbot_id}}`
//   );

  try {
    console.log("🔍 Fetching chatbot info for:", chatbot_id);
    const { data } = await serverClient.query<GetChatbotByIdResponse>({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
    });

    const chatbot = data.chatbots;
    if (!chatbot) {
      console.error("❌ Chatbot not found in DB");
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    console.log("📜 Fetching message history for session:", chat_session_id);
    const { data: messagesData } = await serverClient.query({
      query: GET_MESSAGES_BY_CHAT_SESSION_ID,
      variables: { chat_session_id },
      fetchPolicy: "no-cache",
    });

    const previousMessages = messagesData.chat_sessions.messages || [];
    // console.log("🧠 Message History:", previousMessages);

    const systemPrompt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join(" + ");

    const chatHistory = previousMessages.map(
      (msg) => `${msg.sender === "ai" ? "AI" : name}: ${msg.content}`
    );

    const fullPrompt = `You are a helpful assistant talking to ${name}. If a generic message is asked that is not relevant to the key information section, tell them it's restricted. Use emojis where appropriate. Key info: ${systemPrompt}\n\n${chatHistory.join(
      "\n"
    )}\nUser: ${content}`;

    console.log("🛠️ Constructed prompt:", fullPrompt);

    const useMock =
      process.env.USE_OPENAI_MOCK === "true" || !process.env.OPENAI_API_KEY;

    let aiResponse: string;

    if (useMock) {
      console.warn("🔧 Development or missing API key: Using mock response.");
      aiResponse = "🤖 [Mock] Hello! This is a development fallback response.";
    } else {
    //   console.log("🤖 Calling OpenAI API...");

      const result = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant. Key info: ${systemPrompt}`,
          },
          ...previousMessages.map((msg) => ({
            role: msg.sender === "ai" ? "assistant" : "user",
            content: msg.content,
          })),
          { role: "user", content },
        ],
      });

      aiResponse = result.choices[0]?.message?.content?.trim() || "";

      if (!aiResponse) {
        console.error("❌ AI failed to generate a response");
        return NextResponse.json(
          { error: "Failed to generate AI response" },
          { status: 500 }
        );
      }
    }

    // console.log("💾 Storing user message...");
    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        sender: "user",
        content,
        created_at: new Date().toISOString(),
      },
    });

    // console.log("💾 Storing AI response...");
    let aiMessageResult;
    try {
      aiMessageResult = await serverClient.mutate({
        mutation: INSERT_MESSAGE,
        variables: {
          chat_session_id,
          sender: "ai",
          content: aiResponse,
          created_at: new Date().toISOString(),
        },
      });

    //   console.log("✅ AI message insert result:", aiMessageResult);
    } catch (mutationErr) {
      console.error("❌ AI message insertion failed:", mutationErr);
      return NextResponse.json(
        { error: "Failed to insert AI message" },
        { status: 500 }
      );
    }

    const inserted = aiMessageResult?.data?.insertMessages;
    if (!inserted || !inserted.id) {
      console.error(
        "❌ insertMessages.id is missing from result:",
        aiMessageResult?.data
      );
      return NextResponse.json(
        { error: "AI message insert result malformed" },
        { status: 500 }
      );
    }

    console.log("✅ Returning response to client:", {
      id: inserted.id,
      content: aiResponse,
    });

    return NextResponse.json({
      id: inserted.id,
      content: aiResponse,
    });
  } catch (error: any) {
    if (error?.code === "insufficient_quota") {
      return NextResponse.json(
        {
          error:
            "OpenAI quota exceeded. Please check your plan or billing at https://platform.openai.com/account/usage.",
        },
        { status: 429 }
      );
    }

    // console.error("Error in /api/send-message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


// Google Gemini
// import { INSERT_MESSAGE } from "@/graphQl/mutations/mutations";
// import {
//   GET_CHATBOT_BY_ID,
//   GET_MESSAGES_BY_CHAT_SESSION_ID,
// } from "@/graphQl/queries/queries";
// import { serverClient } from "@/lib/server/serverClient";
// import { GetChatbotByIdResponse } from "@/types/types";
// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!, {
//   apiVersion: "v1beta",
// });

// export async function POST(req: NextRequest) {
//   const { chat_session_id, chatbot_id, content, name } = await req.json();

//   if (!content || !chat_session_id || !chatbot_id || !name) {
//     console.error("❌ Missing fields:", {
//       content,
//       chat_session_id,
//       chatbot_id,
//       name,
//     });
//     return NextResponse.json(
//       { error: "Missing required fields" },
//       { status: 400 }
//     );
//   }

//   console.log(
//     `📩 Received message from session ${chat_session_id}: ${content} {chatbot: ${chatbot_id}}`
//   );

//   try {
//     console.log("🔍 Fetching chatbot info for:", chatbot_id);
//     const { data } = await serverClient.query<GetChatbotByIdResponse>({
//       query: GET_CHATBOT_BY_ID,
//       variables: { id: chatbot_id },
//     });

//     const chatbot = data.chatbots;
//     if (!chatbot) {
//       console.error("❌ Chatbot not found in DB");
//       return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
//     }

//     console.log("📜 Fetching message history for session:", chat_session_id);
//     const { data: messagesData } = await serverClient.query({
//       query: GET_MESSAGES_BY_CHAT_SESSION_ID,
//       variables: { chat_session_id },
//       fetchPolicy: "no-cache",
//     });

//     const previousMessages = messagesData.chat_sessions.messages || [];
//     console.log("🧠 Message History:", previousMessages);

//     const systemPrompt = chatbot.chatbot_characteristics
//       .map((c) => c.content)
//       .join(" + ");

//     const chatHistory = previousMessages.map(
//       (msg) => `${msg.sender === "ai" ? "AI" : name}: ${msg.content}`
//     );

//     const fullPrompt = `You are a helpful assistant talking to ${name}. If a generic message is asked that is not relevant to the key information section, tell them it's restricted. Use emojis where appropriate. Key info: ${systemPrompt}\n\n${chatHistory.join(
//       "\n"
//     )}\nUser: ${content}`;

//     console.log("🛠️ Constructed prompt:", fullPrompt);

//     const useMock = process.env.USE_GEMINI_MOCK === "true";
//     console.log("🔐 Loaded GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

//     const modelName = "models/text-bison-001";
//     const model = genAI.getGenerativeModel({ model: modelName });
//     let aiResponse = "";

//     console.log("🤖 Calling Gemini API...");

//     if (useMock) {
//       console.warn("🔧 Development or missing API key: Using mock response.");
//       aiResponse = "🤖 [Mock] Hello! This is a development fallback response.";
//     } else {
//       let result;

//       if (modelName.includes("bison")) {
//         // Use text model properly
//         const textModel = genAI.getTextModel({ model: modelName });
//         result = await textModel.generateText({
//           prompt: fullPrompt,
//         });
//         aiResponse = result.response.text().trim();
//       } else {
//         // Use chat model
//         const chatModel = genAI.getGenerativeModel({ model: modelName });
//         result = await chatModel.generateContent({
//           contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
//         });
//         aiResponse = result.response.text().trim();
//       }

//       if (!aiResponse) {
//         console.error("❌ AI failed to generate a response");
//         return NextResponse.json(
//           { error: "Failed to generate AI response" },
//           { status: 500 }
//         );
//       }
//     }

//     console.log("💾 Storing user message...");
//     await serverClient.mutate({
//       mutation: INSERT_MESSAGE,
//       variables: {
//         chat_session_id,
//         sender: "user",
//         content,
//         created_at: new Date().toISOString(),
//       },
//     });

//     console.log("💾 Storing AI response...");
//     let aiMessageResult;
//     try {
//       aiMessageResult = await serverClient.mutate({
//         mutation: INSERT_MESSAGE,
//         variables: {
//           chat_session_id,
//           sender: "ai",
//           content: aiResponse,
//           created_at: new Date().toISOString(),
//         },
//       });

//       console.log("✅ AI message insert result:", aiMessageResult);
//     } catch (mutationErr) {
//       console.error("❌ AI message insertion failed:", mutationErr);
//       return NextResponse.json(
//         { error: "Failed to insert AI message" },
//         { status: 500 }
//       );
//     }

//     const inserted = aiMessageResult?.data?.insertMessages;
//     if (!inserted || !inserted.id) {
//       console.error(
//         "❌ insertMessages.id is missing from result:",
//         aiMessageResult?.data
//       );
//       return NextResponse.json(
//         { error: "AI message insert result malformed" },
//         { status: 500 }
//       );
//     }

//     console.log("✅ Returning response to client:", {
//       id: inserted.id,
//       content: aiResponse,
//     });

//     return NextResponse.json({
//       id: inserted.id,
//       content: aiResponse,
//     });
//   } catch (error: any) {
//     if (error?.code === "insufficient_quota") {
//       return NextResponse.json(
//         {
//           error:
//             "Gemini quota exceeded. Please check your plan or billing at https://aistudio.google.com/app/apikey.",
//         },
//         { status: 429 }
//       );
//     }

//     console.error("Error in /api/send-message:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

