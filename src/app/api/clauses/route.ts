import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { documentChunks } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const clauses = await db
    .select({
      id: documentChunks.id,
      clauseNumber: documentChunks.clauseNumber,
      sectionTitle: documentChunks.sectionTitle,
      pageNumber: documentChunks.pageNumber,
      content: documentChunks.content,
    })
    .from(documentChunks)
    .orderBy(asc(documentChunks.pageNumber));

  return NextResponse.json(clauses);
}
