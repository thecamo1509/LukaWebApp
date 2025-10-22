import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import * as mutations from "./mutations";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    userProfile: {
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

describe("UserProfile Mutations", () => {
  const mockUserId = "clxyz123456789";
  const mockProfile = {
    id: "profile_123",
    userId: mockUserId,
    selectedStrategy: "RECOMMENDED" as const,
    onboardingCompleted: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUserProfile", () => {
    it("should create a new user profile", async () => {
      const input = {
        userId: mockUserId,
        selectedStrategy: "RECOMMENDED" as const,
      };

      vi.mocked(prisma.userProfile.create).mockResolvedValue(mockProfile);

      const result = await mutations.createUserProfile(input);

      expect(result).toEqual(mockProfile);
      expect(prisma.userProfile.create).toHaveBeenCalledWith({
        data: {
          userId: input.userId,
          selectedStrategy: input.selectedStrategy,
          onboardingCompleted: false,
        },
      });
    });
  });

  describe("updateUserProfile", () => {
    it("should update user profile", async () => {
      const input = {
        selectedStrategy: "CONSERVATIVE" as const,
        onboardingCompleted: true,
      };

      const updatedProfile = {
        ...mockProfile,
        ...input,
        updatedAt: new Date(),
      };

      vi.mocked(prisma.userProfile.update).mockResolvedValue(updatedProfile);

      const result = await mutations.updateUserProfile(mockUserId, input);

      expect(result.selectedStrategy).toBe(input.selectedStrategy);
      expect(result.onboardingCompleted).toBe(input.onboardingCompleted);
      expect(prisma.userProfile.update).toHaveBeenCalled();
    });
  });

  describe("upsertUserProfile", () => {
    it("should upsert user profile", async () => {
      const input = {
        userId: mockUserId,
        selectedStrategy: "SAVER" as const,
      };

      vi.mocked(prisma.userProfile.upsert).mockResolvedValue({
        ...mockProfile,
        selectedStrategy: input.selectedStrategy,
      });

      const result = await mutations.upsertUserProfile(mockUserId, input);

      expect(result.selectedStrategy).toBe(input.selectedStrategy);
      expect(prisma.userProfile.upsert).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        create: expect.objectContaining({
          userId: input.userId,
          selectedStrategy: input.selectedStrategy,
        }),
        update: expect.objectContaining({
          selectedStrategy: input.selectedStrategy,
        }),
      });
    });
  });

  describe("markOnboardingComplete", () => {
    it("should mark onboarding as complete", async () => {
      const completedProfile = {
        ...mockProfile,
        onboardingCompleted: true,
        updatedAt: new Date(),
      };

      vi.mocked(prisma.userProfile.update).mockResolvedValue(completedProfile);

      const result = await mutations.markOnboardingComplete(mockUserId);

      expect(result.onboardingCompleted).toBe(true);
      expect(prisma.userProfile.update).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        data: {
          onboardingCompleted: true,
          updatedAt: expect.any(Date),
        },
      });
    });
  });
});
