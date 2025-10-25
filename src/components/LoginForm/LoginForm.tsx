"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import styles from "./LoginForm.module.css";
import type { LoginFormProps } from "./LoginForm.types";

export function LoginForm({
  onSuccess,
  showTitle = true,
  showRegisterLink = true,
  onboardingMode = false,
  onBeforeSignIn,
  callbackUrl = "/dashboard",
}: LoginFormProps) {
  const handleGoogleSignIn = async () => {
    try {
      // If in onboarding mode, execute callback before sign in
      if (onboardingMode && onBeforeSignIn) {
        await onBeforeSignIn();
      }

      await signIn("google", {
        callbackUrl,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error; // Re-throw to let parent handle it
    }
  };

  return (
    <div className={styles.container}>
      {showTitle && (
        <div className={styles.header}>
          <h2 className={styles.title}>Inicia sesión</h2>
          <p className={styles.description}>
            Accede a tu cuenta para continuar
          </p>
        </div>
      )}

      <div className={styles.content}>
        <Button
          onClick={handleGoogleSignIn}
          className={styles.googleButton}
          size="lg"
        >
          <svg
            className={styles.googleIcon}
            viewBox="0 0 24 24"
            role="img"
            aria-label="Google logo"
          >
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar con Google
        </Button>

        {showRegisterLink && (
          <>
            <div className={styles.divider}>
              <span className={styles.dividerText}>o</span>
            </div>

            <p className={styles.helpText}>
              ¿No tienes cuenta?{" "}
              <a href="/onboarding" className={styles.link}>
                Regístrate aquí
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
