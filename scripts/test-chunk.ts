import { chunkText } from "../src/lib/chunker";

const testPages = [
  "CLAUSE 1. Preliminary\n\nThis is a test clause with content about income tax and VAT.\n\nCLAUSE 2. Amendment of Act\n\nThis clause amends the Income Tax Act Cap 470.",
  "PART III — VALUE ADDED TAX\n\n15. Amendment of section 5\n\nSection 5 of the Value Added Tax Act is amended by inserting after subsection (2) the following new subsection.",
];

const chunks = chunkText(testPages);
console.log("Total chunks:", chunks.length);
chunks.forEach((c, i) => {
  console.log(`\nChunk ${i + 1}:`);
  console.log("  clauseNumber:", c.clauseNumber);
  console.log("  sectionTitle:", c.sectionTitle);
  console.log("  pageNumber:", c.pageNumber);
  console.log("  content (first 100):", c.content.slice(0, 100));
});
