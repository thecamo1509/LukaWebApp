import styles from "./layout.module.css";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.blob} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
