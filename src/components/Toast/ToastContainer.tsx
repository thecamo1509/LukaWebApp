"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Toast } from "./Toast";
import type { ToastType } from "./Toast.types";

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 5000) => {
      const id = Math.random().toString(36).substring(7);
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}
