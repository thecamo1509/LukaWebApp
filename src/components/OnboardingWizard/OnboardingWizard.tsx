"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Step1Strategy } from "./OnboardingSteps/Step1Strategy";
import { Step2Source } from "./OnboardingSteps/Step2Source";
import { Step3Login } from "./OnboardingSteps/Step3Login";
import styles from "./OnboardingWizard.module.css";

export function OnboardingWizard() {
  const { currentStep, strategy, source, nextStep, prevStep } =
    useOnboardingStore();

  const handleNext = () => {
    if (!isStepValid()) {
      // Trigger validation errors to show
      return;
    }
    if (currentStep < 3) {
      nextStep();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return strategy !== null && strategy.type !== null;
      case 2:
        return source !== null;
      case 3:
        return true; // Login step is always valid
      default:
        return false;
    }
  };

  return (
    <div className={styles.container}>
      {currentStep === 1 && <Step1Strategy />}
      {currentStep === 2 && <Step2Source />}
      {currentStep === 3 && <Step3Login />}

      <div className={styles.actions}>
        {currentStep > 1 && (
          <Button
            onClick={handleBack}
            variant="outline"
            className={styles.backButton}
          >
            ← Atrás
          </Button>
        )}

        {currentStep < 3 && (
          <Button onClick={handleNext} className={styles.nextButton}>
            Continuar →
          </Button>
        )}
      </div>

      <div className={styles.stepIndicator}>
        <span className={styles.stepInfo}>Paso {currentStep} de 3</span>
      </div>
    </div>
  );
}
