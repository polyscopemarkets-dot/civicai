import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { documentChunks } from "@/lib/db/schema";
import { groq, MODEL, buildExplainPrompt } from "@/lib/groq";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { clauseId, clauseText, clauseRef } = await req.json() as {
    clauseId?: number;
    clauseText?: string;
    clauseRef?: string;
  };

  let content: string;
  let ref: string;

  if (clauseId) {
    const rows = await db
      .select()
      .from(documentChunks)
      .where(eq(documentChunks.id, clauseId))
      .limit(1);

    if (!rows.length) {
      return NextResponse.json({ error: "Clause not found" }, { status: 404 });
    }
    content = rows[0].content;
    ref = clauseRef ?? `${rows[0].clauseNumber ?? "Unknown"}, Page ${rows[0].pageNumber ?? "?"}`;
  } else if (clauseText) {
    content = clauseText;
    ref = clauseRef ?? "Finance Bill 2026";
  } else {
    return NextResponse.json({ error: "clauseId or clauseText required" }, { status: 400 });
  }

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: buildExplainPrompt(content, ref) }],
    max_tokens: 512,
    temperature: 0.4,
  });

  return NextResponse.json({
    explanation: completion.choices[0].message.content,
    ref,
  });
}
