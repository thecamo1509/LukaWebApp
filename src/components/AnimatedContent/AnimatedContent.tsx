"use client";

import { motion } from "framer-motion";
import styles from "./AnimatedContent.module.css";
import type { AnimatedContentProps } from "./AnimatedContent.types";

export function AnimatedContent({
  children,
  delay = 0,
  duration = 0.5,
  className,
}: AnimatedContentProps) {
  return (
    <motion.div
      className={className || styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
