import { prisma } from "@/lib/prisma";
import type { UserProfileDTO } from "./user-profile.types";

export async function getUserProfile(
  userId: string,
): Promise<UserProfileDTO | null> {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  return profile as UserProfileDTO | null;
}

export async function userHasCompletedOnboarding(
  userId: string,
): Promise<boolean> {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { onboardingCompleted: true },
  });

  return profile?.onboardingCompleted ?? false;
}
