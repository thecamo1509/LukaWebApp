import { OnboardingWizard } from "@/components/OnboardingWizard/OnboardingWizard";
import styles from "./page.module.css";

export default function OnboardingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>¡Comienza tu viaje financiero! 🚀</h1>
        <p className={styles.subtitle}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className={styles.link}>
            Inicia sesión aquí
          </a>
        </p>
      </div>

      <div className={styles.content}>
        <p className={styles.description}>
          Miles de personas ya están alcanzando sus metas financieras con Luka.
          Solo toma <span className={styles.highlight}>2 minutos</span>{" "}
          configurar tu cuenta y empezar a tomar control de tu dinero.
        </p>

        <OnboardingWizard />
      </div>
    </div>
  );
}
