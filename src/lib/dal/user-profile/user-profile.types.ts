import type { StrategyType, UserProfile } from "@prisma/client";

// ============================================
// DAL Types
// ============================================

export type UserProfileDTO = UserProfile;

export interface CreateUserProfileInput {
  userId: string;
  selectedStrategy: StrategyType;
}

export interface UpdateUserProfileInput {
  selectedStrategy?: StrategyType;
  onboardingCompleted?: boolean;
}
