"use server";

import type { SourceSubtype, SourceType, StrategyType } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { clearOnboardingData, getOnboardingData } from "@/lib/cookies";
import { prisma } from "@/lib/prisma";

export async function actionCompleteAfterAuth(): Promise<void> {
  // Check if user is authenticated
  const session = await auth();

  if (!session?.user?.id) {
    // Not authenticated, redirect to onboarding
    redirect("/onboarding");
  }

  const userId = session.user.id;

  // Get onboarding data from cookies
  const onboardingData = await getOnboardingData();

  if (!onboardingData) {
    // No data found, redirect to dashboard
    redirect("/dashboard");
  }

  try {
    // Create source and profile in a transaction
    await prisma.$transaction(async (tx) => {
      // Create the initial source
      await tx.source.create({
        data: {
          userId,
          name: onboardingData.source.name,
          type: onboardingData.source.type as SourceType,
          subtype: onboardingData.source.subtype as SourceSubtype | undefined,
          balance: onboardingData.source.balance,
          color: onboardingData.source.color,
          sourceNumber: onboardingData.source.sourceNumber,
          active: true,
        },
      });

      // Create or update user profile
      await tx.userProfile.upsert({
        where: { userId },
        create: {
          userId,
          selectedStrategy: onboardingData.strategy as StrategyType,
          onboardingCompleted: true,
        },
        update: {
          selectedStrategy: onboardingData.strategy as StrategyType,
          onboardingCompleted: true,
        },
      });
    });

    // Clear the onboarding data cookie (now in Server Action, it's allowed)
    await clearOnboardingData();
  } catch (error) {
    console.error("Error completing onboarding:", error);
    // Clear cookie anyway to prevent infinite loop
    try {
      await clearOnboardingData();
    } catch (cookieError) {
      console.error("Error clearing cookie:", cookieError);
    }
  }

  // Redirect to dashboard
  redirect("/dashboard");
}
