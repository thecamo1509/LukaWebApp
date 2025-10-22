import { beforeEach, describe, expect, it, vi } from "vitest";
import * as M from "@/lib/dal/sources/mutations";
import * as Q from "@/lib/dal/sources/queries";
import * as actions from "./sources";

// Mock auth
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock DAL
vi.mock("@/lib/dal/sources/queries");
vi.mock("@/lib/dal/sources/mutations");

const { auth } = await import("@/auth");

describe("Source Actions", () => {
  const mockUserId = "clxyz123456789";
  const mockSession = {
    user: { id: mockUserId, email: "test@example.com" },
    expires: "2024-12-31",
  };

  const mockSource = {
    id: "clxyz987654321",
    userId: mockUserId,
    name: "Bancolombia",
    type: "BANK_ACCOUNT" as const,
    subtype: "SAVINGS" as const,
    balance: 1000000,
    color: "#f5a623",
    sourceNumber: "1234",
    active: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue(
      mockSession as unknown as Awaited<ReturnType<typeof auth>>,
    );
  });

  describe("actionListSources", () => {
    it("should list sources with pagination", async () => {
      const mockResult = {
        items: [mockSource],
        nextCursor: null,
        total: 1,
      };

      vi.mocked(Q.listSources).mockResolvedValue(mockResult);

      const result = await actions.actionListSources({
        limit: 20,
        activeOnly: true,
      });

      expect(result).toEqual(mockResult);
      expect(Q.listSources).toHaveBeenCalledWith(mockUserId, {
        limit: 20,
        activeOnly: true,
      });
    });

    it("should throw error if not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue(null);

      await expect(actions.actionListSources({ limit: 20 })).rejects.toThrow(
        "Unauthorized",
      );
    });
  });

  describe("actionGetSource", () => {
    it("should get source by id", async () => {
      vi.mocked(Q.getSourceById).mockResolvedValue(mockSource);

      const result = await actions.actionGetSource("clxyz987654321");

      expect(result).toEqual(mockSource);
      expect(Q.getSourceById).toHaveBeenCalledWith(
        mockUserId,
        "clxyz987654321",
      );
    });

    it("should throw error if source not found", async () => {
      vi.mocked(Q.getSourceById).mockResolvedValue(null);

      await expect(actions.actionGetSource("clxyz111111111")).rejects.toThrow(
        "Source not found",
      );
    });
  });

  describe("actionCreateSource", () => {
    it("should create a new source", async () => {
      const input = {
        name: "Bancolombia",
        type: "BANK_ACCOUNT" as const,
        subtype: "SAVINGS" as const,
        balance: 1000000,
        color: "#f5a623",
        sourceNumber: "1234",
      };

      vi.mocked(M.createSource).mockResolvedValue(mockSource);

      const result = await actions.actionCreateSource(input);

      expect(result).toEqual(mockSource);
      expect(M.createSource).toHaveBeenCalledWith(mockUserId, input);
    });

    it("should throw validation error for invalid input", async () => {
      const invalidInput = {
        name: "",
        type: "INVALID",
        balance: -100,
      };

      await expect(actions.actionCreateSource(invalidInput)).rejects.toThrow();
    });
  });

  describe("actionUpdateSource", () => {
    it("should update an existing source", async () => {
      const input = {
        id: "clxyz987654321",
        name: "Bancolombia Actualizado",
        balance: 1500000,
      };

      const updatedSource = { ...mockSource, ...input };
      vi.mocked(M.updateSource).mockResolvedValue(updatedSource);

      const result = await actions.actionUpdateSource(input);

      expect(result).toEqual(updatedSource);
      expect(M.updateSource).toHaveBeenCalledWith(mockUserId, input);
    });
  });

  describe("actionDeleteSource", () => {
    it("should delete a source", async () => {
      const deletedSource = {
        ...mockSource,
        active: false,
        deletedAt: new Date(),
      };

      vi.mocked(M.deleteSource).mockResolvedValue(deletedSource);

      const result = await actions.actionDeleteSource("clxyz987654321");

      expect(result).toEqual(deletedSource);
      expect(M.deleteSource).toHaveBeenCalledWith(mockUserId, "clxyz987654321");
    });
  });

  describe("actionRestoreSource", () => {
    it("should restore a deleted source", async () => {
      const restoredSource = {
        ...mockSource,
        active: true,
        deletedAt: null,
      };

      vi.mocked(M.restoreSource).mockResolvedValue(restoredSource);

      const result = await actions.actionRestoreSource("clxyz987654321");

      expect(result).toEqual(restoredSource);
      expect(M.restoreSource).toHaveBeenCalledWith(
        mockUserId,
        "clxyz987654321",
      );
    });
  });

  describe("actionGetTotalBalance", () => {
    it("should return total balance", async () => {
      vi.mocked(Q.getTotalBalance).mockResolvedValue(1500000);

      const result = await actions.actionGetTotalBalance();

      expect(result).toBe(1500000);
      expect(Q.getTotalBalance).toHaveBeenCalledWith(mockUserId);
    });
  });
});
