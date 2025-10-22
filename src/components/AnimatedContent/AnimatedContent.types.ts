import type { ReactNode } from "react";

export interface AnimatedContentProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}
