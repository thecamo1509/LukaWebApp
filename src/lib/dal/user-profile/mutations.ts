import { prisma } from "@/lib/prisma";
import type {
  CreateUserProfileInput,
  UpdateUserProfileInput,
  UserProfileDTO,
} from "./user-profile.types";

export async function createUserProfile(
  input: CreateUserProfileInput,
): Promise<UserProfileDTO> {
  const profile = await prisma.userProfile.create({
    data: {
      userId: input.userId,
      selectedStrategy: input.selectedStrategy,
      onboardingCompleted: false,
    },
  });

  return profile as UserProfileDTO;
}

export async function updateUserProfile(
  userId: string,
  input: UpdateUserProfileInput,
): Promise<UserProfileDTO> {
  const profile = await prisma.userProfile.update({
    where: { userId },
    data: {
      selectedStrategy: input.selectedStrategy,
      onboardingCompleted: input.onboardingCompleted,
      updatedAt: new Date(),
    },
  });

  return profile as UserProfileDTO;
}

export async function upsertUserProfile(
  userId: string,
  input: CreateUserProfileInput,
): Promise<UserProfileDTO> {
  const profile = await prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId: input.userId,
      selectedStrategy: input.selectedStrategy,
      onboardingCompleted: false,
    },
    update: {
      selectedStrategy: input.selectedStrategy,
      updatedAt: new Date(),
    },
  });

  return profile as UserProfileDTO;
}

export async function markOnboardingComplete(
  userId: string,
): Promise<UserProfileDTO> {
  const profile = await prisma.userProfile.update({
    where: { userId },
    data: {
      onboardingCompleted: true,
      updatedAt: new Date(),
    },
  });

  return profile as UserProfileDTO;
}
