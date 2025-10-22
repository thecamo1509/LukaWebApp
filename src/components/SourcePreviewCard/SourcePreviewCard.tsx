import styles from "./SourcePreviewCard.module.css";
import type { SourcePreviewCardProps } from "./SourcePreviewCard.types";

const SUBTYPE_LABELS: Record<string, string> = {
  savings: "Cuenta de ahorros",
  checking: "Cuenta corriente",
  debit_card: "Tarjeta débito",
  credit_card: "Tarjeta crédito",
};

export function SourcePreviewCard({
  name,
  subtype,
  balance,
  color,
  sourceNumber,
  userName = "Camilo Morales",
}: SourcePreviewCardProps) {
  const subtypeLabel = subtype ? SUBTYPE_LABELS[subtype] || "" : "";

  return (
    <div className={styles.card} style={{ backgroundColor: color }}>
      <div className={styles.header}>
        <h3 className={styles.name}>{name || "Bancolombia"}</h3>
        <p className={styles.subtype}>{subtypeLabel || "Cuenta de ahorros"}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.info}>
          <span className={styles.userName}>{userName}</span>
          <span className={styles.number}>
            •••• •••• •••• {sourceNumber || "2378"}
          </span>
        </div>
        <div className={styles.logo}>
          <div className={styles.logoCircle} />
          <div className={styles.logoCircle} />
        </div>
      </div>

      <div className={styles.balance}>
        ${Number(balance || 0).toLocaleString("es-CO")}
      </div>
    </div>
  );
}
