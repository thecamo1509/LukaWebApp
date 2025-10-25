"use server";

import type { OnboardingData } from "@/lib/cookies";
import { setOnboardingData } from "@/lib/cookies";

export async function actionSaveOnboardingData(
  data: OnboardingData,
): Promise<void> {
  await setOnboardingData(data);
}
