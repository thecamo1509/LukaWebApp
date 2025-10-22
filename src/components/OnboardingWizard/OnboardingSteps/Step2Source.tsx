"use client";

import { useEffect, useState } from "react";
import { AnimatedContent } from "@/components/AnimatedContent/AnimatedContent";
import { SourceForm } from "@/components/SourceForm/SourceForm";
import type { SourceFormValues } from "@/components/SourceForm/SourceForm.types";
import { SourcePreviewCard } from "@/components/SourcePreviewCard/SourcePreviewCard";
import {
  type Source,
  type SourceSubtype,
  type SourceType,
  useOnboardingStore,
} from "@/store/useOnboardingStore";
import { COLORS } from "./Step2Source.constants";
import styles from "./Step2Source.module.css";

export function Step2Source() {
  const { source, setSource } = useOnboardingStore();

  const [formValues, setFormValues] = useState<Partial<SourceFormValues>>({
    name: source?.name || "",
    type: source?.type || "bank_account",
    subtype: source?.subtype || "savings",
    balance: source?.balance || 0,
    color: source?.color || COLORS[0],
    source_number: source?.source_number || "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [attemptedContinue, setAttemptedContinue] = useState(false);

  const handleFormChange = (values: Partial<SourceFormValues>) => {
    setFormValues(values);
    if (attemptedContinue) {
      setAttemptedContinue(false);
    }
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  // Auto-save to store when form is valid
  useEffect(() => {
    if (
      isFormValid &&
      formValues.name &&
      formValues.type &&
      formValues.balance !== undefined &&
      formValues.balance > 0 &&
      formValues.color
    ) {
      const newSource: Source = {
        name: formValues.name,
        type: formValues.type as SourceType,
        subtype: formValues.subtype as SourceSubtype,
        balance: Number(formValues.balance),
        color: formValues.color,
        source_number: formValues.source_number || "",
        active: true,
      };
      setSource(newSource);
    } else {
      // Clear source if form is invalid
      setSource(null);
    }
  }, [formValues, isFormValid, setSource]);

  return (
    <AnimatedContent key="step2">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.stepDescription}>
            <span className={styles.highlight}>
              Por ultimo, agrega una fuente
            </span>
          </p>
          <p className={styles.instructions}>
            Para iniciar a usar tus lukas solo necesitas agregar al menos una
            fuente. Las fuentes son aquellas de donde registrarás ingresos o
            gastos. Estas pueden ser efectivo, tarjeta o cuenta.
          </p>
          <p className={styles.instructions}>
            Selecciona un tipo de fuente para iniciar tu cuenta y añade un saldo
            inicial.
          </p>
        </div>

        <div className={styles.previewSection}>
          <div className={styles.previewLabel}>Vista previa</div>
          <SourcePreviewCard
            name={formValues.name || "Bancolombia"}
            type={(formValues.type as SourceType) || "bank_account"}
            subtype={(formValues.subtype as SourceSubtype) || "savings"}
            balance={formValues.balance || 0}
            color={formValues.color || COLORS[0]}
            sourceNumber={formValues.source_number || "2378"}
          />
        </div>

        <div className={styles.formSection}>
          <SourceForm
            defaultValues={formValues}
            onFormChange={handleFormChange}
            onValidationChange={handleValidationChange}
            triggerValidation={attemptedContinue}
          />
        </div>
      </div>
    </AnimatedContent>
  );
}
