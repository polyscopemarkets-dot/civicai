import Groq from "groq-sdk";
import type { UserProfile } from "@/types";
import type { DocumentChunk } from "@/types";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const MODEL = "llama-3.3-70b-versatile";

function describeProfile(profile: UserProfile): string {
  if (!profile.role) return "a Kenyan citizen";
  const roleMap: Record<string, string> = {
    employee: "an employee",
    business_owner: "a business owner",
    investor: "an investor",
    farmer: "a farmer",
    student: "a student",
  };
  const role = roleMap[profile.role] ?? profile.role;
  const parts = [role];
  if (profile.industry) parts.push(`in the ${profile.industry} sector`);
  if (profile.businessSize) parts.push(`(${profile.businessSize}-sized business)`);
  if (profile.salaryRange) parts.push(`earning ${profile.salaryRange} KES/month`);
  return parts.join(" ");
}

export function buildChatSystemPrompt(profile: UserProfile, chunks: DocumentChunk[]): string {
  const context = chunks
    .map(
      (c) =>
        `[${c.clauseNumber ?? "Section"}, Page ${c.pageNumber ?? "?"}]:\n${c.content}`
    )
    .join("\n\n---\n\n");

  return `You are CivicAI, a helpful assistant that explains Kenya's Finance Bill 2026 to ordinary citizens.
The user is ${describeProfile(profile)}.

Your job:
1. Answer questions using ONLY the provided context below.
2. Cite your sources inline as [Clause X, Page Y] or [Section Title, Page Y].
3. Use simple, clear language. Avoid legal jargon — explain terms when you use them.
4. If the context doesn't cover the question, say "I don't have enough information on that clause" — do not make up answers.
5. Tailor your explanation to the user's role and industry where relevant.

CONTEXT FROM FINANCE BILL 2026:
${context}`;
}

export function buildExplainPrompt(clauseContent: string, clauseRef: string): string {
  return `You are CivicAI. Explain the following clause from Kenya's Finance Bill 2026 in plain English for an ordinary Kenyan citizen who is not a lawyer.

Clause reference: ${clauseRef}

Clause text:
${clauseContent}

Your explanation must:
- Use simple, everyday language
- Give a concrete real-world example of how this affects someone
- Be concise (3-5 sentences)
- Mention any key obligations, deadlines, or amounts where applicable`;
}

export function buildImpactPrompt(
  profile: UserProfile,
  amount: number,
  type: "employee" | "business",
  chunks: DocumentChunk[]
): string {
  const context = chunks
    .map(
      (c) =>
        `[${c.clauseNumber ?? "Section"}, Page ${c.pageNumber ?? "?"}]:\n${c.content}`
    )
    .join("\n\n---\n\n");

  const amountDesc =
    type === "employee"
      ? `monthly salary of KES ${amount.toLocaleString()}`
      : `annual business turnover of KES ${amount.toLocaleString()}`;

  return `You are CivicAI. A user who is ${describeProfile(profile)} with a ${amountDesc} wants to understand how Kenya's Finance Bill 2026 affects them financially.

Using ONLY the retrieved clauses below, provide a structured impact analysis:

1. NEW TAX OBLIGATIONS — List any new taxes or levies that apply
2. CHANGES TO EXISTING TAXES — How existing taxes (VAT, income tax, etc.) change for this person
3. ESTIMATED FINANCIAL IMPACT — Calculate approximate KES amounts where the clauses provide enough info
4. COMPLIANCE REQUIREMENTS — New paperwork, deadlines, or registration requirements
5. OPPORTUNITIES — Any reliefs, exemptions, or incentives that could benefit this person

Be specific. Use KES amounts. Cite clauses.

CONTEXT:
${context}`;
}
