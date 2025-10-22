import type { StrategyType } from "@/components/StrategyCard/StrategyCard.types";

export type SourceType = "cash" | "bank_account" | "card";
export type SourceSubtype =
  | "savings"
  | "checking"
  | "debit_card"
  | "credit_card"
  | null;

export interface Source {
  id?: string;
  name: string;
  type: SourceType;
  subtype: SourceSubtype;
  balance: number;
  color: string;
  source_number: string;
  active: boolean;
}

export type StrategyIconName = "trophy" | "shield" | "trending" | "piggybank";

export interface Strategy {
  type: StrategyType;
  name: string;
  iconName: StrategyIconName;
  allocation: string;
  isRecommended: boolean;
}

export interface OnboardingState {
  currentStep: number;
  strategy: Strategy;
  source: Source | null;
  monthlyIncome: string;
  savingsGoal: string;

  // Actions
  setCurrentStep: (step: number) => void;
  setStrategy: (strategy: Strategy) => void;
  setSource: (source: Source) => void;
  setMonthlyIncome: (income: string) => void;
  setSavingsGoal: (goal: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}
