import type { SourceSubtype, SourceType } from "@prisma/client";
import { z } from "zod";

// ============================================
// Zod Schemas for Validation
// ============================================

export const createSourceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  type: z.enum(["CASH", "BANK_ACCOUNT", "CARD"], {
    message: "Tipo de fuente inválido",
  }),
  subtype: z
    .enum(["SAVINGS", "CHECKING", "DEBIT_CARD", "CREDIT_CARD"])
    .nullable()
    .optional(),
  balance: z.number({ message: "El saldo es requerido" }).min(0),
  color: z.string().min(1, "El color es requerido"),
  sourceNumber: z.string().optional(),
});

export const updateSourceSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(100).optional(),
  type: z.enum(["CASH", "BANK_ACCOUNT", "CARD"]).optional(),
  subtype: z
    .enum(["SAVINGS", "CHECKING", "DEBIT_CARD", "CREDIT_CARD"])
    .nullable()
    .optional(),
  balance: z.number().min(0).optional(),
  color: z.string().min(1).optional(),
  sourceNumber: z.string().optional(),
  active: z.boolean().optional(),
});

export const listSourcesSchema = z.object({
  cursor: z.string().cuid().nullish(),
  limit: z.number().int().min(1).max(100).default(20),
  activeOnly: z.boolean().default(true),
});

export const sourceIdSchema = z.string().cuid();

// ============================================
// TypeScript Types
// ============================================

export type CreateSourceInput = z.infer<typeof createSourceSchema>;
export type UpdateSourceInput = z.infer<typeof updateSourceSchema>;
export type ListSourcesQuery = z.infer<typeof listSourcesSchema>;

export interface SourceResponse {
  id: string;
  userId: string;
  name: string;
  type: SourceType;
  subtype: SourceSubtype | null;
  balance: number;
  color: string;
  sourceNumber: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ListSourcesResponse {
  items: SourceResponse[];
  nextCursor: string | null;
  total: number;
}
