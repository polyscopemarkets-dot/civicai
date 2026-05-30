CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "document_chunks" (
  "id" serial PRIMARY KEY NOT NULL,
  "clause_number" text,
  "section_title" text,
  "page_number" integer,
  "content" text NOT NULL,
  "embedding" vector(384)
);

CREATE INDEX IF NOT EXISTS "embedding_idx" ON "document_chunks" USING hnsw ("embedding" vector_cosine_ops);
