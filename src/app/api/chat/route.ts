import { NextRequest } from "next/server";
import { retrieveChunks } from "@/lib/rag";
import { groq, MODEL, buildChatSystemPrompt } from "@/lib/groq";
import type { UserProfile } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { message, userProfile, history = [] } = await req.json() as {
    message: string;
    userProfile: UserProfile;
    history: { role: "user" | "assistant"; content: string }[];
  };

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
  }

  const chunks = await retrieveChunks(message, 6);
  const systemPrompt = buildChatSystemPrompt(userProfile, chunks);

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: message },
  ];

  const groqStream = await groq.chat.completions.create({
    model: MODEL,
    messages,
    stream: true,
    max_tokens: 1024,
    temperature: 0.3,
  });

  const encoder = new TextEncoder();
  const citationsPayload = JSON.stringify(chunks);

  const stream = new ReadableStream({
    async start(controller) {
      // Send citations first as a special event
      controller.enqueue(
        encoder.encode(`event: citations\ndata: ${citationsPayload}\n\n`)
      );

      for await (const part of groqStream) {
        const text = part.choices[0]?.delta?.content ?? "";
        if (text) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
          );
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
