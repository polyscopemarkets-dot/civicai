export interface Chunk {
  clauseNumber: string | null;
  sectionTitle: string | null;
  pageNumber: number;
  content: string;
}

const MAX_WORDS = 600;
const OVERLAP_WORDS = 100;
const MIN_WORDS = 20;

// Patterns to extract clause/section metadata from text
const CLAUSE_RE = /(CLAUSE\s+\d+[A-Z]?)/i;
const PART_RE = /(PART\s+[IVXLCDM]+|PART\s+\d+)/i;
const SECTION_NUM_RE = /^(\d{1,3}[A-Z]?)\.\s+([A-Z][^\n]{5,80})/m;

function extractMeta(text: string): { clauseNumber: string | null; sectionTitle: string | null } {
  const clauseMatch = text.match(CLAUSE_RE);
  if (clauseMatch) {
    return { clauseNumber: clauseMatch[1], sectionTitle: null };
  }
  const partMatch = text.match(PART_RE);
  if (partMatch) {
    return { clauseNumber: partMatch[1], sectionTitle: null };
  }
  const secMatch = text.match(SECTION_NUM_RE);
  if (secMatch) {
    return { clauseNumber: `Section ${secMatch[1]}`, sectionTitle: secMatch[2].trim() };
  }
  return { clauseNumber: null, sectionTitle: null };
}

export function chunkText(pages: string[]): Chunk[] {
  const allChunks: Chunk[] = [];

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const pageNumber = pageIdx + 1;
    const pageText = pages[pageIdx].trim();

    if (!pageText) continue;

    const words = pageText.split(/\s+/);
    if (words.length < MIN_WORDS) continue;

    const { clauseNumber, sectionTitle } = extractMeta(pageText);

    let start = 0;
    while (start < words.length) {
      const slice = words.slice(start, start + MAX_WORDS).join(" ");
      if (slice.trim().split(/\s+/).length >= MIN_WORDS) {
        allChunks.push({ clauseNumber, sectionTitle, pageNumber, content: slice });
      }
      start += MAX_WORDS - OVERLAP_WORDS;
    }
  }

  return allChunks;
}
