"use server";

import type { StrategyType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  type CompleteOnboardingResponse,
  completeOnboardingSchema,
} from "./onboarding.types";

// Note: 'use server' files can only export async functions, not constants like runtime
// The runtime is automatically nodejs for server actions

// ============================================
// Helper Functions
// ============================================

async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: No active session");
  }
  return session.user.id;
}

// ============================================
// Onboarding Actions
// ============================================

export async function actionCompleteOnboarding(
  input: unknown,
): Promise<CompleteOnboardingResponse> {
  try {
    const userId = await getAuthenticatedUserId();
    const data = completeOnboardingSchema.parse(input);

    // Execute everything in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create or update UserProfile with selected strategy
      const profile = await tx.userProfile.upsert({
        where: { userId },
        create: {
          userId,
          selectedStrategy: data.strategy as StrategyType,
          onboardingCompleted: true,
        },
        update: {
          selectedStrategy: data.strategy as StrategyType,
          onboardingCompleted: true,
          updatedAt: new Date(),
        },
      });

      // 2. Create initial source
      const source = await tx.source.create({
        data: {
          userId,
          name: data.source.name,
          type: data.source.type,
          subtype: data.source.subtype,
          balance: data.source.balance,
          color: data.source.color,
          sourceNumber: data.source.sourceNumber,
          active: true,
        },
      });

      return { profile, source };
    });

    // Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/onboarding");

    return {
      success: true,
      userId,
      profileId: result.profile.id,
      sourceId: result.source.id,
      redirectUrl: "/dashboard",
    };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error al completar el onboarding. Por favor, intenta de nuevo.",
    );
  }
}

export async function actionCheckOnboardingStatus(): Promise<{
  completed: boolean;
  hasProfile: boolean;
}> {
  try {
    const userId = await getAuthenticatedUserId();

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { onboardingCompleted: true },
    });

    return {
      completed: profile?.onboardingCompleted ?? false,
      hasProfile: !!profile,
    };
  } catch (_error) {
    return {
      completed: false,
      hasProfile: false,
    };
  }
}
