"use client";

import { PiggyBank, Shield, TrendingUp, Trophy } from "lucide-react";
import { AnimatedContent } from "@/components/AnimatedContent/AnimatedContent";
import { StrategyCard } from "@/components/StrategyCard/StrategyCard";
import type { StrategyType } from "@/components/StrategyCard/StrategyCard.types";
import type { Strategy, StrategyIconName } from "@/store/useOnboardingStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import styles from "./Step1Strategy.module.css";

type StrategyConfig = {
  type: StrategyType;
  name: string;
  iconName: StrategyIconName;
  allocation: string;
  isRecommended: boolean;
};

const STRATEGIES: StrategyConfig[] = [
  {
    type: "recommended",
    name: "Recomendado",
    iconName: "trophy",
    allocation: "60 / 10 / 10 / 20",
    isRecommended: true,
  },
  {
    type: "conservative",
    name: "Conservador",
    iconName: "shield",
    allocation: "50 / 15 / 15 / 20",
    isRecommended: false,
  },
  {
    type: "saver",
    name: "Ahorrador",
    iconName: "piggybank",
    allocation: "50 / 30 / 10 / 20",
    isRecommended: false,
  },
  {
    type: "investor",
    name: "Inversionista",
    iconName: "trending",
    allocation: "50 / 10 / 30 / 10",
    isRecommended: false,
  },
];

const getIcon = (iconName: StrategyIconName) => {
  switch (iconName) {
    case "trophy":
      return <Trophy />;
    case "shield":
      return <Shield />;
    case "piggybank":
      return <PiggyBank />;
    case "trending":
      return <TrendingUp />;
  }
};

export function Step1Strategy() {
  const { strategy, setStrategy } = useOnboardingStore();

  const handleStrategySelect = (strategyConfig: StrategyConfig) => {
    const selectedStrategy: Strategy = {
      type: strategyConfig.type,
      name: strategyConfig.name,
      iconName: strategyConfig.iconName,
      allocation: strategyConfig.allocation,
      isRecommended: strategyConfig.isRecommended,
    };
    setStrategy(selectedStrategy);
  };

  return (
    <AnimatedContent key="step1">
      <div className={styles.stepContent}>
        <div className={styles.header}>
          <p className={styles.stepDescription}>
            Selecciona la estrategia que mejor se ajuste a tu estilo de vida.{" "}
            <span className={styles.highlight}>
              Podrás cambiarla cuando quieras.
            </span>
          </p>
        </div>

        <div className={styles.strategies}>
          {STRATEGIES.map((strategyConfig) => (
            <StrategyCard
              key={strategyConfig.type}
              type={strategyConfig.type}
              title={strategyConfig.name}
              icon={getIcon(strategyConfig.iconName)}
              allocation={strategyConfig.allocation}
              isRecommended={strategyConfig.isRecommended}
              isSelected={strategy.type === strategyConfig.type}
              onClick={() => handleStrategySelect(strategyConfig)}
            />
          ))}
        </div>
      </div>
    </AnimatedContent>
  );
}
