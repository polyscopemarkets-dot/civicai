import { pgTable, serial, text, integer, index } from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";

const vector = customType<{ data: number[]; driverData: string }>({
  dataType(config) {
    const dims = (config as { dimensions?: number })?.dimensions ?? 384;
    return `vector(${dims})`;
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: string): number[] {
    if (typeof value === "string") {
      return JSON.parse(value.replace(/^\[/, "[").replace(/\]$/, "]"));
    }
    return value as unknown as number[];
  },
});

export const documentChunks = pgTable(
  "document_chunks",
  {
    id: serial("id").primaryKey(),
    clauseNumber: text("clause_number"),
    sectionTitle: text("section_title"),
    pageNumber: integer("page_number"),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 384 }),
  },
  (table) => ({
    embeddingIdx: index("embedding_idx").on(table.embedding),
  })
);
