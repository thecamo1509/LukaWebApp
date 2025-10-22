import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import * as actions from "./onboarding";

// Mock auth
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    userProfile: {
      findUnique: vi.fn(),
    },
  },
}));

const { auth } = await import("@/auth");

describe("Onboarding Actions", () => {
  const mockUserId = "clxyz123456789";
  const mockSession = {
    user: { id: mockUserId, email: "test@example.com" },
    expires: "2024-12-31",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue(
      mockSession as unknown as Awaited<ReturnType<typeof auth>>,
    );
  });

  describe("actionCompleteOnboarding", () => {
    it("should complete onboarding successfully", async () => {
      const input = {
        source: {
          name: "Bancolombia",
          type: "BANK_ACCOUNT" as const,
          subtype: "SAVINGS" as const,
          balance: 1000000,
          color: "#f5a623",
          sourceNumber: "1234",
        },
        strategy: "RECOMMENDED" as const,
      };

      const mockResult = {
        profile: {
          id: "profile_123",
          userId: mockUserId,
          selectedStrategy: "RECOMMENDED" as const,
          onboardingCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        source: {
          id: "source_123",
          userId: mockUserId,
          name: "Bancolombia",
          type: "BANK_ACCOUNT",
          subtype: "SAVINGS",
          balance: 1000000,
          color: "#f5a623",
          sourceNumber: "1234",
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        return await callback(prisma as unknown as typeof prisma);
      });

      vi.mocked(prisma.$transaction).mockResolvedValue(mockResult);

      const result = await actions.actionCompleteOnboarding(input);

      expect(result.success).toBe(true);
      expect(result.userId).toBe(mockUserId);
      expect(result.profileId).toBe(mockResult.profile.id);
      expect(result.sourceId).toBe(mockResult.source.id);
      expect(result.redirectUrl).toBe("/dashboard");
    });

    it("should throw error if not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const input = {
        source: {
          name: "Test",
          type: "CASH" as const,
          balance: 100,
          color: "#fff",
        },
        strategy: "RECOMMENDED" as const,
      };

      await expect(actions.actionCompleteOnboarding(input)).rejects.toThrow(
        "Unauthorized",
      );
    });

    it("should throw validation error for invalid input", async () => {
      const invalidInput = {
        source: {
          name: "",
          type: "INVALID",
          balance: -100,
        },
        strategy: "INVALID_STRATEGY",
      };

      await expect(
        actions.actionCompleteOnboarding(invalidInput),
      ).rejects.toThrow();
    });
  });

  describe("actionCheckOnboardingStatus", () => {
    it("should return onboarding status", async () => {
      vi.mocked(prisma.userProfile.findUnique).mockResolvedValue({
        id: "profile_123",
        userId: mockUserId,
        selectedStrategy: "RECOMMENDED",
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await actions.actionCheckOnboardingStatus();

      expect(result.completed).toBe(true);
      expect(result.hasProfile).toBe(true);
    });

    it("should return false if no profile exists", async () => {
      vi.mocked(prisma.userProfile.findUnique).mockResolvedValue(null);

      const result = await actions.actionCheckOnboardingStatus();

      expect(result.completed).toBe(false);
      expect(result.hasProfile).toBe(false);
    });
  });
});
