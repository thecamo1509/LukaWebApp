"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./StrategyCard.module.css";
import type { StrategyCardProps } from "./StrategyCard.types";

export function StrategyCard({
  title,
  icon,
  allocation,
  isRecommended = false,
  isSelected = false,
  onClick,
  fullHeight = false,
}: StrategyCardProps) {
  return (
    <div className={cn(styles.wrapper, fullHeight && styles.wrapperFullHeight)}>
      <button
        type="button"
        className={cn(
          styles.card,
          isSelected && styles.cardSelected,
          fullHeight && styles.cardFullHeight,
        )}
        onClick={onClick}
      >
        {isRecommended && <div className={styles.badge}>TOP</div>}

        <div className={styles.iconContainer}>
          <div className={styles.icon}>{icon}</div>
        </div>

        <h3 className={styles.title}>{title}</h3>
      </button>

      <div className={styles.allocationContainer}>
        <span className={styles.allocation}>{allocation}</span>
        <Info className={styles.infoIcon} />
      </div>
    </div>
  );
}
