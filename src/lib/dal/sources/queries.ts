import { prisma } from "@/lib/prisma";
import type {
  ListSourcesQuery,
  ListSourcesResult,
  SourceDTO,
} from "./sources.types";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function listSources(
  userId: string,
  query: ListSourcesQuery = {},
): Promise<ListSourcesResult> {
  const limit = Math.min(query.limit || DEFAULT_LIMIT, MAX_LIMIT);
  const cursor = query.cursor ? { id: query.cursor } : undefined;
  const activeOnly = query.activeOnly ?? true;

  const where = {
    userId,
    ...(activeOnly ? { active: true, deletedAt: null } : {}),
  };

  // Get items + 1 to check if there's a next page
  const items = await prisma.source.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    cursor,
    skip: cursor ? 1 : 0,
  });

  // Get total count
  const total = await prisma.source.count({ where });

  // Check if there are more items
  const hasMore = items.length > limit;
  const returnItems = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? returnItems[returnItems.length - 1].id : null;

  return {
    items: returnItems as SourceDTO[],
    nextCursor,
    total,
  };
}

export async function getSourceById(
  userId: string,
  id: string,
): Promise<SourceDTO | null> {
  const source = await prisma.source.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
  });

  return source as SourceDTO | null;
}

export async function getSourcesByType(
  userId: string,
  type: string,
): Promise<SourceDTO[]> {
  const sources = await prisma.source.findMany({
    where: {
      userId,
      type: type as "CASH" | "BANK_ACCOUNT" | "CARD",
      active: true,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  return sources as SourceDTO[];
}

export async function getTotalBalance(userId: string): Promise<number> {
  const result = await prisma.source.aggregate({
    where: {
      userId,
      active: true,
      deletedAt: null,
    },
    _sum: {
      balance: true,
    },
  });

  return result._sum.balance || 0;
}
