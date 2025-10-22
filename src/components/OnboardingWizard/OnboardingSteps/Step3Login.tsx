"use client";

import { PiggyBank, Shield, TrendingUp, Trophy } from "lucide-react";
import { actionCompleteOnboarding } from "@/actions/onboarding/onboarding";
import { AnimatedContent } from "@/components/AnimatedContent/AnimatedContent";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import { SourcePreviewCard } from "@/components/SourcePreviewCard/SourcePreviewCard";
import { StrategyCard } from "@/components/StrategyCard/StrategyCard";
import { useToast } from "@/components/Toast/ToastContainer";
import type { StrategyIconName } from "@/store/useOnboardingStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import styles from "./Step3Login.module.css";

const getIconFromName = (iconName: StrategyIconName) => {
  switch (iconName) {
    case "trophy":
      return <Trophy key="trophy" />;
    case "shield":
      return <Shield key="shield" />;
    case "trending":
      return <TrendingUp key="trending" />;
    case "piggybank":
      return <PiggyBank key="piggybank" />;
  }
};

export function Step3Login() {
  const { strategy, source } = useOnboardingStore();
  const { showToast } = useToast();

  // Create unique key based on strategy and source to force re-render on changes
  const contentKey = `step3-${strategy.type}-${source?.name}`;

  const handleCompleteOnboarding = async () => {
    if (!source) {
      showToast("Error: No se ha configurado una fuente", "error");
      return;
    }

    try {
      await actionCompleteOnboarding({
        source: {
          name: source.name,
          type: source.type,
          subtype: source.subtype,
          balance: source.balance,
          color: source.color,
          sourceNumber: source.source_number,
        },
        strategy: strategy.type.toUpperCase(),
      });

      showToast("¡Onboarding completado con éxito!", "success", 3000);
      // The sign in will happen in LoginForm after this resolves
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al completar el onboarding";
      showToast(errorMessage, "error");
      throw error; // Re-throw to prevent sign in
    }
  };

  return (
    <AnimatedContent key={contentKey}>
      <div className={styles.stepContent}>
        <div className={styles.header}>
          <h2 className={styles.stepTitle}>¡Ya casi terminas!</h2>
          <p className={styles.stepDescription}>
            Revisa tu configuración y luego inicia sesión para guardar tus datos
          </p>
        </div>

        <div className={styles.previewSection}>
          <div className={styles.previewGroup}>
            <h3 className={styles.previewTitle}>Tu estrategia seleccionada</h3>
            <StrategyCard
              key={`strategy-${strategy.type}`}
              type={strategy.type}
              title={strategy.name}
              icon={getIconFromName(strategy.iconName)}
              allocation={strategy.allocation}
              isRecommended={strategy.isRecommended}
              isSelected
              onClick={() => {}}
              fullHeight
            />
          </div>

          <div className={styles.previewGroup}>
            <h5 className={styles.previewTitle}>Tu fuente inicial</h5>
            {source && (
              <SourcePreviewCard
                name={source.name}
                type={source.type}
                subtype={source.subtype}
                balance={source.balance}
                color={source.color}
                sourceNumber={source.source_number}
              />
            )}
          </div>
        </div>

        <div className={styles.loginSection}>
          <LoginForm
            showTitle={false}
            showRegisterLink={false}
            onboardingMode
            onBeforeSignIn={handleCompleteOnboarding}
          />
        </div>
      </div>
    </AnimatedContent>
  );
}
