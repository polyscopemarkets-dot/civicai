import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import { db } from "../src/lib/db";
import { documentChunks } from "../src/lib/db/schema";
import { embed } from "../src/lib/embeddings";
import { chunkText } from "../src/lib/chunker";

const PDF_PATH = path.join(process.cwd(), "THE FINANCE BILL,2026 (1)_1.pdf");
const BATCH_SIZE = 5;

async function main() {
  console.log("Loading PDF...");
  const buffer = fs.readFileSync(PDF_PATH);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);

  console.log(`PDF loaded: ${data.numpages} pages, ${data.text.length} characters`);

  // Try form-feed split first, fallback to treating all text as single block
  let pages = data.text.split("\f").filter((p: string) => p.trim().length > 50);
  if (pages.length <= 1) {
    // No form-feed separators — split the single text block into ~1500-char segments
    // to simulate pages, preserving page number approximation
    const charsPerPage = Math.ceil(data.text.length / data.numpages);
    pages = [];
    for (let i = 0; i < data.text.length; i += charsPerPage) {
      const slice = data.text.slice(i, i + charsPerPage + 200); // slight overlap
      if (slice.trim().length > 50) pages.push(slice);
    }
  }

  console.log(`Split into ${pages.length} sections`);

  console.log("Chunking text...");
  const chunks = chunkText(pages);
  console.log(`Created ${chunks.length} chunks`);

  if (chunks.length === 0) {
    console.error("No chunks created — check PDF content");
    process.exit(1);
  }

  // Clear existing data
  await db.delete(documentChunks);
  console.log("Cleared existing chunks");

  // Embed and insert in batches
  let inserted = 0;
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const records = await Promise.all(
      batch.map(async (chunk) => {
        const embedding = await embed(chunk.content);
        return {
          clauseNumber: chunk.clauseNumber,
          sectionTitle: chunk.sectionTitle,
          pageNumber: chunk.pageNumber,
          content: chunk.content,
          embedding,
        };
      })
    );

    await db.insert(documentChunks).values(records);
    inserted += batch.length;
    process.stdout.write(`\rIngested ${inserted}/${chunks.length} chunks...`);
  }

  console.log(`\nDone! Ingested ${inserted} chunks into the database.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
