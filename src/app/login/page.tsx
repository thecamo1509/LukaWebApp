import { LoginForm } from "@/components/LoginForm/LoginForm";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.blob} />
      <div className={styles.content}>
        <LoginForm showTitle showRegisterLink />
      </div>
    </div>
  );
}
