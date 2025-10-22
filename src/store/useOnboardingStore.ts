import { create } from "zustand";
import type { OnboardingState } from "./useOnboardingStore.types";

// Re-export types for convenience
export type {
  OnboardingState,
  Source,
  SourceSubtype,
  SourceType,
  Strategy,
  StrategyIconName,
} from "./useOnboardingStore.types";

const INITIAL_STATE = {
  currentStep: 1,
  strategy: {
    type: "recommended" as const,
    name: "Recomendado",
    iconName: "trophy" as const,
    allocation: "60 / 10 / 10 / 20",
    isRecommended: true,
  },
  source: null,
  monthlyIncome: "",
  savingsGoal: "",
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...INITIAL_STATE,

  setCurrentStep: (step) => set({ currentStep: step }),
  setStrategy: (strategy) => set({ strategy }),
  setSource: (source) => set({ source }),
  setMonthlyIncome: (monthlyIncome) => set({ monthlyIncome }),
  setSavingsGoal: (savingsGoal) => set({ savingsGoal }),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(1, state.currentStep - 1),
    })),

  reset: () => set(INITIAL_STATE),
}));
