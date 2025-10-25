import { cookies } from "next/headers";

const ONBOARDING_DATA_KEY = "luka_onboarding_data";

export interface OnboardingData {
  source: {
    name: string;
    type: "CASH" | "BANK_ACCOUNT" | "CARD";
    subtype?: "SAVINGS" | "CHECKING" | "DEBIT_CARD" | "CREDIT_CARD";
    balance: number;
    color: string;
    sourceNumber?: string;
  };
  strategy: "RECOMMENDED" | "CONSERVATIVE" | "SAVER" | "INVESTOR";
}

export async function setOnboardingData(data: OnboardingData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ONBOARDING_DATA_KEY, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });
}

export async function getOnboardingData(): Promise<OnboardingData | null> {
  const cookieStore = await cookies();
  const data = cookieStore.get(ONBOARDING_DATA_KEY);

  if (!data?.value) {
    return null;
  }

  try {
    return JSON.parse(data.value) as OnboardingData;
  } catch {
    return null;
  }
}

export async function clearOnboardingData(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ONBOARDING_DATA_KEY);
}
