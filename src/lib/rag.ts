import { sql } from "drizzle-orm";
import { db } from "./db";
import { embed } from "./embeddings";
import type { DocumentChunk } from "@/types";

export async function retrieveChunks(query: string, topK = 5): Promise<DocumentChunk[]> {
  const queryEmbedding = await embed(query);
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const result = await db.execute(sql`
    SELECT
      id,
      clause_number,
      section_title,
      page_number,
      content,
      1 - (embedding <=> ${embeddingStr}::vector) AS similarity
    FROM document_chunks
    ORDER BY embedding <=> ${embeddingStr}::vector
    LIMIT ${topK}
  `);

  return result.rows.map((row) => ({
    id: row.id as number,
    clauseNumber: row.clause_number as string | null,
    sectionTitle: row.section_title as string | null,
    pageNumber: row.page_number as number | null,
    content: row.content as string,
    similarity: row.similarity as number,
  }));
}
