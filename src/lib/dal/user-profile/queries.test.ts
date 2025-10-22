import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import * as queries from "./queries";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    userProfile: {
      findUnique: vi.fn(),
    },
  },
}));

describe("UserProfile Queries", () => {
  const mockUserId = "clxyz123456789";
  const mockProfile = {
    id: "profile_123",
    userId: mockUserId,
    selectedStrategy: "RECOMMENDED" as const,
    onboardingCompleted: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserProfile", () => {
    it("should return user profile", async () => {
      vi.mocked(prisma.userProfile.findUnique).mockResolvedValue(mockProfile);

      const result = await queries.getUserProfile(mockUserId);

      expect(result).toEqual(mockProfile);
      expect(prisma.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
    });

    it("should return null if profile not found", async () => {
      vi.mocked(prisma.userProfile.findUnique).mockResolvedValue(null);

      const result = await queries.getUserProfile(mockUserId);

      expect(result).toBeNull();
    });
  });

  describe("userHasCompletedOnboarding", () => {
    it("should return true if onboarding completed", async () => {
      vi.mocked(prisma.userProfile.findUnique).mockResolvedValue({
        ...mockProfile,
        onboardingCompleted: true,
      });

      const result = await queries.userHasCompletedOnboarding(mockUserId);

      expect(result).toBe(true);
      expect(prisma.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        select: { onboardingCompleted: true },
      });
    });

    it("should return false if onboarding not completed", async () => {
      vi.mocked(prisma.userProfile.findUnique).mockResolvedValue({
        ...mockProfile,
        onboardingCompleted: false,
      });

      const result = await queries.userHasCompletedOnboarding(mockUserId);

      expect(result).toBe(false);
    });

    it("should return false if profile not found", async () => {
      vi.mocked(prisma.userProfile.findUnique).mockResolvedValue(null);

      const result = await queries.userHasCompletedOnboarding(mockUserId);

      expect(result).toBe(false);
    });
  });
});
