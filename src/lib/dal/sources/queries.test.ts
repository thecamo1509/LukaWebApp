import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import * as queries from "./queries";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    source: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}));

describe("Source Queries", () => {
  const mockUserId = "user_123";
  const mockSources = [
    {
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
    },
    {
      id: "source_2",
      userId: mockUserId,
      name: "Efectivo",
      type: "CASH",
      subtype: null,
      balance: 500000,
      color: "#4a90e2",
      sourceNumber: null,
      active: true,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
      deletedAt: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listSources", () => {
    it("should list sources with default pagination", async () => {
      vi.mocked(prisma.source.findMany).mockResolvedValue(mockSources);
      vi.mocked(prisma.source.count).mockResolvedValue(2);

      const result = await queries.listSources(mockUserId);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.nextCursor).toBeNull();
    });

    it("should handle pagination with cursor", async () => {
      vi.mocked(prisma.source.findMany).mockResolvedValue([mockSources[1]]);
      vi.mocked(prisma.source.count).mockResolvedValue(2);

      const result = await queries.listSources(mockUserId, {
        cursor: "source_1",
        limit: 1,
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe("source_2");
    });

    it("should filter active sources only", async () => {
      const activeSources = mockSources.filter((s) => s.active);
      vi.mocked(prisma.source.findMany).mockResolvedValue(activeSources);
      vi.mocked(prisma.source.count).mockResolvedValue(2);

      await queries.listSources(mockUserId, { activeOnly: true });

      expect(prisma.source.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUserId,
            active: true,
            deletedAt: null,
          }),
        }),
      );
    });
  });

  describe("getSourceById", () => {
    it("should return source by id", async () => {
      vi.mocked(prisma.source.findFirst).mockResolvedValue(mockSources[0]);

      const result = await queries.getSourceById(mockUserId, "source_1");

      expect(result).toEqual(mockSources[0]);
      expect(prisma.source.findFirst).toHaveBeenCalledWith({
        where: {
          id: "source_1",
          userId: mockUserId,
          deletedAt: null,
        },
      });
    });

    it("should return null if source not found", async () => {
      vi.mocked(prisma.source.findFirst).mockResolvedValue(null);

      const result = await queries.getSourceById(mockUserId, "nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getSourcesByType", () => {
    it("should return sources filtered by type", async () => {
      const cashSources = mockSources.filter((s) => s.type === "CASH");
      vi.mocked(prisma.source.findMany).mockResolvedValue(cashSources);

      const result = await queries.getSourcesByType(mockUserId, "CASH");

      expect(result).toHaveLength(cashSources.length);
      expect(prisma.source.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: "CASH",
          }),
        }),
      );
    });
  });

  describe("getTotalBalance", () => {
    it("should return total balance of active sources", async () => {
      vi.mocked(prisma.source.aggregate).mockResolvedValue({
        _sum: { balance: 1500000 },
      } as { _sum: { balance: number | null } });

      const result = await queries.getTotalBalance(mockUserId);

      expect(result).toBe(1500000);
      expect(prisma.source.aggregate).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          active: true,
          deletedAt: null,
        },
        _sum: {
          balance: true,
        },
      });
    });

    it("should return 0 if no sources", async () => {
      vi.mocked(prisma.source.aggregate).mockResolvedValue({
        _sum: { balance: null },
      } as { _sum: { balance: number | null } });

      const result = await queries.getTotalBalance(mockUserId);

      expect(result).toBe(0);
    });
  });
});
