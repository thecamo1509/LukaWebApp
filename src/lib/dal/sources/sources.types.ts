import type { Source, SourceSubtype, SourceType } from "@prisma/client";

// ============================================
// DAL Types
// ============================================

export type SourceDTO = Source;

export interface CreateSourceInput {
  name: string;
  type: SourceType;
  subtype?: SourceSubtype | null;
  balance: number;
  color: string;
  sourceNumber?: string;
}

export interface UpdateSourceInput {
  id: string;
  name?: string;
  type?: SourceType;
  subtype?: SourceSubtype | null;
  balance?: number;
  color?: string;
  sourceNumber?: string;
  active?: boolean;
}

export interface ListSourcesQuery {
  cursor?: string | null;
  limit?: number;
  activeOnly?: boolean;
}

export interface ListSourcesResult {
  items: SourceDTO[];
  nextCursor: string | null;
  total: number;
}
