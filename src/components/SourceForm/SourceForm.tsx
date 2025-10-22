"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { CirclePicker } from "react-color";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COLORS } from "../OnboardingWizard/OnboardingSteps/Step2Source.constants";
import styles from "./SourceForm.module.css";
import {
  type SourceFormProps,
  type SourceFormValues,
  SUBTYPE_OPTIONS,
  sourceFormSchema,
  TYPE_OPTIONS,
} from "./SourceForm.types";

export function SourceForm({
  defaultValues,
  onFormChange,
  onValidationChange,
  triggerValidation = false,
}: SourceFormProps) {
  const form = useForm<SourceFormValues>({
    resolver: zodResolver(sourceFormSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: defaultValues?.name || "",
      type: defaultValues?.type || "bank_account",
      subtype: defaultValues?.subtype || "savings",
      balance: defaultValues?.balance || 0,
      color: defaultValues?.color || COLORS[0],
      source_number: defaultValues?.source_number || "",
    },
  });

  const watchType = form.watch("type");
  const watchSubtype = form.watch("subtype");

  useEffect(() => {
    if (watchType === "cash") {
      form.setValue("subtype", null);
    } else if (watchType === "bank_account" && !watchSubtype) {
      form.setValue("subtype", "savings");
    } else if (watchType === "card" && !watchSubtype) {
      form.setValue("subtype", "debit_card");
    }
  }, [watchType, form, watchSubtype]);

  // Watch form changes and notify parent
  useEffect(() => {
    const validateForm = async () => {
      if (onValidationChange) {
        const isValid = await form.trigger();
        onValidationChange(isValid);
      }
    };

    const subscription = form.watch(async (values) => {
      if (onFormChange) {
        onFormChange(values as Partial<SourceFormValues>);
      }
      // Trigger validation
      await validateForm();
    });

    // Initial validation
    validateForm();

    return () => subscription.unsubscribe();
  }, [form, onFormChange, onValidationChange]);

  // Force validation when triggerValidation prop changes
  useEffect(() => {
    if (triggerValidation) {
      form.trigger();
    }
  }, [triggerValidation, form]);

  const getNumberLabel = () => {
    if (watchType === "cash") return "Número de referencia (opcional)";
    if (watchType === "bank_account") {
      const subtypeLabel =
        SUBTYPE_OPTIONS[watchType].find((opt) => opt.value === watchSubtype)
          ?.label || "";
      return `Número de ${subtypeLabel} (opcional)`;
    }
    if (watchType === "card") {
      return watchSubtype === "credit_card"
        ? "Número de tarjeta de crédito (opcional)"
        : "Número de tarjeta de débito (opcional)";
    }
    return "Número (opcional)";
  };

  return (
    <Form {...form}>
      <form className={styles.form}>
        <div className={styles.rowDouble}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.label}>
                  Nombre de la fuente
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Bancolombia"
                    className={styles.input}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.label}>Saldo inicial</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="8900000"
                    className={styles.input}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(Number.isNaN(value) ? 0 : value);
                    }}
                    value={field.value || 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className={styles.rowDouble}>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.label}>Tipo de fuente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={styles.select}>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.label}>
                  {getNumberLabel()}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="2378"
                    className={styles.input}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchType !== "cash" && (
          <FormField
            control={form.control}
            name="subtype"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.label}>Subtipo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className={styles.select}>
                      <SelectValue placeholder="Selecciona un subtipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUBTYPE_OPTIONS[watchType].map((option) => (
                      <SelectItem key={option.value} value={option.value || ""}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={styles.label}>
                Color de la tarjeta
              </FormLabel>
              <FormControl>
                <div className={styles.colorPickerWrapper}>
                  <CirclePicker
                    color={field.value}
                    colors={COLORS}
                    onChangeComplete={(color) => field.onChange(color.hex)}
                    circleSize={40}
                    circleSpacing={14}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
