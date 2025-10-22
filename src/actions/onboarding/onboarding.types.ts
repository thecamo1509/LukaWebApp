import { z } from "zod";

// ============================================
// Zod Schemas for Validation
// ============================================

export const completeOnboardingSchema = z.object({
  source: z.object({
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
  }),
  strategy: z.enum(["RECOMMENDED", "CONSERVATIVE", "SAVER", "INVESTOR"], {
    message: "Estrategia inválida",
  }),
});

export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;

export interface CompleteOnboardingResponse {
  success: boolean;
  userId: string;
  profileId: string;
  sourceId: string;
  redirectUrl: string;
}
