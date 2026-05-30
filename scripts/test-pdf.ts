import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import { chunkText } from "../src/lib/chunker";

const PDF_PATH = path.join(process.cwd(), "THE FINANCE BILL,2026 (1)_1.pdf");

async function main() {
  const buffer = fs.readFileSync(PDF_PATH);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);

  console.log("numpages:", data.numpages, "| text chars:", data.text.length);

  let pages = data.text.split("\f").filter((p: string) => p.trim().length > 50);
  if (pages.length <= 1) {
    const charsPerPage = Math.ceil(data.text.length / data.numpages);
    pages = [];
    for (let i = 0; i < data.text.length; i += charsPerPage) {
      const slice = data.text.slice(i, i + charsPerPage + 200);
      if (slice.trim().length > 50) pages.push(slice);
    }
  }
  console.log("Sections:", pages.length);

  const chunks = chunkText(pages);
  console.log("Total chunks:", chunks.length);

  if (chunks.length > 0) {
    console.log("\nSample chunks:");
    [0, 10, 20].forEach(i => {
      if (chunks[i]) {
        console.log(`  [${i}] page=${chunks[i].pageNumber} clause=${chunks[i].clauseNumber} | ${chunks[i].content.slice(0, 100)}`);
      }
    });
  }
}

main().catch(console.error);
