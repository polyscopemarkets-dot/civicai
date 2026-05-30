import { NextRequest, NextResponse } from "next/server";
import { retrieveChunks } from "@/lib/rag";
import { groq, MODEL, buildImpactPrompt } from "@/lib/groq";
import type { UserProfile } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { type, amount, userProfile } = await req.json() as {
    type: "employee" | "business";
    amount: number;
    userProfile: UserProfile;
  };

  if (!type || !amount) {
    return NextResponse.json({ error: "type and amount are required" }, { status: 400 });
  }

  const queries = [
    type === "employee" ? "income tax PAYE salary levy employee" : "corporate tax VAT business turnover levy",
    "withholding tax deductions",
    "excise duty",
    "tax relief exemption",
  ];

  const allChunks = await Promise.all(queries.map((q) => retrieveChunks(q, 3)));
  const seen = new Set<number>();
  const chunks = allChunks.flat().filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  const prompt = buildImpactPrompt(userProfile, amount, type, chunks.slice(0, 10));

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
    temperature: 0.3,
  });

  return NextResponse.json({
    report: completion.choices[0].message.content,
    citations: chunks.slice(0, 10),
  });
}
