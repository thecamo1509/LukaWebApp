import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to your Dashboard</h2>
      <p className={styles.description}>
        This is your protected dashboard area.
      </p>
    </div>
  );
}
