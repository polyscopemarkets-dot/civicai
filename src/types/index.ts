export type UserRole = "employee" | "business_owner" | "investor" | "farmer" | "student";
export type BusinessSize = "micro" | "small" | "medium" | "large";

export interface UserProfile {
  role: UserRole | null;
  industry: string | null;
  businessSize: BusinessSize | null;
  salaryRange: string | null;
  isComplete: boolean;
}

export interface DocumentChunk {
  id: number;
  clauseNumber: string | null;
  sectionTitle: string | null;
  pageNumber: number | null;
  content: string;
  similarity?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: DocumentChunk[];
}
