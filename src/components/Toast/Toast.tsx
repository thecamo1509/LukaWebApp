"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useEffect } from "react";
import styles from "./Toast.module.css";
import type { ToastProps } from "./Toast.types";

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export function Toast({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const Icon = ICONS[type];

  return (
    <AnimatePresence>
      <motion.div
        className={`${styles.toast} ${styles[type]}`}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.iconContainer}>
          <Icon className={styles.icon} />
        </div>

        <p className={styles.message}>{message}</p>

        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Cerrar"
        >
          <X className={styles.closeIcon} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
