import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import * as mutations from "./mutations";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    source: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

describe("Source Mutations", () => {
  const mockUserId = "user_123";
  const mockSource = {
    id: "source_1",
    userId: mockUserId,
    name: "Bancolombia",
    type: "BANK_ACCOUNT",
    subtype: "SAVINGS",
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
  });

  describe("createSource", () => {
    it("should create a new source", async () => {
      const input = {
        name: "Bancolombia",
        type: "BANK_ACCOUNT" as const,
        subtype: "SAVINGS" as const,
        balance: 1000000,
        color: "#f5a623",
        sourceNumber: "1234",
      };

      vi.mocked(prisma.source.create).mockResolvedValue(mockSource);

      const result = await mutations.createSource(mockUserId, input);

      expect(result).toEqual(mockSource);
      expect(prisma.source.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          name: input.name,
          type: input.type,
          subtype: input.subtype,
          balance: input.balance,
          color: input.color,
          sourceNumber: input.sourceNumber,
          active: true,
        },
      });
    });
  });

  describe("updateSource", () => {
    it("should update an existing source", async () => {
      const input = {
        id: "source_1",
        name: "Bancolombia Actualizado",
        balance: 1500000,
      };

      vi.mocked(prisma.source.findFirst).mockResolvedValue(mockSource);
      vi.mocked(prisma.source.update).mockResolvedValue({
        ...mockSource,
        ...input,
        updatedAt: new Date(),
      });

      const result = await mutations.updateSource(mockUserId, input);

      expect(result.name).toBe(input.name);
      expect(result.balance).toBe(input.balance);
      expect(prisma.source.update).toHaveBeenCalled();
    });

    it("should throw error if source not found", async () => {
      vi.mocked(prisma.source.findFirst).mockResolvedValue(null);

      await expect(
        mutations.updateSource(mockUserId, {
          id: "nonexistent",
          name: "Test",
        }),
      ).rejects.toThrow("Source not found");
    });

    it("should not update source of different user", async () => {
      vi.mocked(prisma.source.findFirst).mockResolvedValue(null);

      await expect(
        mutations.updateSource("different_user", {
          id: "source_1",
          name: "Test",
        }),
      ).rejects.toThrow("Source not found");
    });
  });

  describe("deleteSource", () => {
    it("should soft delete a source", async () => {
      vi.mocked(prisma.source.findFirst).mockResolvedValue(mockSource);
      vi.mocked(prisma.source.update).mockResolvedValue({
        ...mockSource,
        active: false,
        deletedAt: new Date(),
      });

      const result = await mutations.deleteSource(mockUserId, "source_1");

      expect(result.active).toBe(false);
      expect(result.deletedAt).toBeTruthy();
      expect(prisma.source.update).toHaveBeenCalledWith({
        where: { id: "source_1" },
        data: {
          active: false,
          deletedAt: expect.any(Date),
        },
      });
    });

    it("should throw error if source not found", async () => {
      vi.mocked(prisma.source.findFirst).mockResolvedValue(null);

      await expect(
        mutations.deleteSource(mockUserId, "nonexistent"),
      ).rejects.toThrow("Source not found");
    });
  });

  describe("hardDeleteSource", () => {
    it("should permanently delete a source", async () => {
      vi.mocked(prisma.source.findFirst).mockResolvedValue(mockSource);
      vi.mocked(prisma.source.delete).mockResolvedValue(mockSource);

      await mutations.hardDeleteSource(mockUserId, "source_1");

      expect(prisma.source.delete).toHaveBeenCalledWith({
        where: { id: "source_1" },
      });
    });

    it("should throw error if source not found", async () => {
      vi.mocked(prisma.source.findFirst).mockResolvedValue(null);

      await expect(
        mutations.hardDeleteSource(mockUserId, "nonexistent"),
      ).rejects.toThrow("Source not found");
    });
  });

  describe("restoreSource", () => {
    it("should restore a deleted source", async () => {
      const deletedSource = {
        ...mockSource,
        active: false,
        deletedAt: new Date(),
      };

      vi.mocked(prisma.source.findFirst).mockResolvedValue(deletedSource);
      vi.mocked(prisma.source.update).mockResolvedValue({
        ...mockSource,
        active: true,
        deletedAt: null,
      });

      const result = await mutations.restoreSource(mockUserId, "source_1");

      expect(result.active).toBe(true);
      expect(result.deletedAt).toBeNull();
      expect(prisma.source.update).toHaveBeenCalledWith({
        where: { id: "source_1" },
        data: {
          active: true,
          deletedAt: null,
          updatedAt: expect.any(Date),
        },
      });
    });
  });
});
