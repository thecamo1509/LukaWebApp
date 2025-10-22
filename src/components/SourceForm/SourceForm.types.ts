import { z } from "zod";
import type {
  SourceSubtype,
  SourceType,
} from "@/store/useOnboardingStore.types";

export interface SourceFormProps {
  defaultValues?: Partial<SourceFormValues>;
  onFormChange?: (values: Partial<SourceFormValues>) => void;
  onValidationChange?: (isValid: boolean) => void;
  triggerValidation?: boolean;
}

export interface TypeOption {
  value: SourceType;
  label: string;
}

export interface SubtypeOption {
  value: SourceSubtype;
  label: string;
}

export const TYPE_OPTIONS: Array<TypeOption> = [
  { value: "cash", label: "Efectivo" },
  { value: "bank_account", label: "Cuenta bancaria" },
  { value: "card", label: "Tarjeta" },
];

export const SUBTYPE_OPTIONS: Record<SourceType, Array<SubtypeOption>> = {
  cash: [],
  bank_account: [
    { value: "savings", label: "Cuenta de ahorros" },
    { value: "checking", label: "Cuenta corriente" },
  ],
  card: [
    { value: "debit_card", label: "Tarjeta débito" },
    { value: "credit_card", label: "Tarjeta crédito" },
  ],
};

export const sourceFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.enum(["cash", "bank_account", "card"], {
    message: "Selecciona un tipo de fuente",
  }),
  subtype: z
    .enum(["savings", "checking", "debit_card", "credit_card"])
    .nullable()
    .optional(),
  balance: z
    .number({ message: "El saldo inicial es requerido" })
    .min(0.01, "El saldo debe ser mayor a 0"),
  color: z.string().min(1, "Selecciona un color"),
  source_number: z.string().optional(),
});

export interface SourceFormValues {
  name: string;
  type: SourceType;
  subtype?: SourceSubtype;
  balance: number;
  color: string;
  source_number?: string;
}
