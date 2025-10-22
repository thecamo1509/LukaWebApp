import { prisma } from "@/lib/prisma";
import type {
  CreateSourceInput,
  SourceDTO,
  UpdateSourceInput,
} from "./sources.types";

export async function createSource(
  userId: string,
  input: CreateSourceInput,
): Promise<SourceDTO> {
  const source = await prisma.source.create({
    data: {
      userId,
      name: input.name,
      type: input.type,
      subtype: input.subtype,
      balance: input.balance,
      color: input.color,
      sourceNumber: input.sourceNumber,
      active: true,
    },
  });

  return source as SourceDTO;
}

export async function updateSource(
  userId: string,
  input: UpdateSourceInput,
): Promise<SourceDTO> {
  // Verify ownership
  const existing = await prisma.source.findFirst({
    where: {
      id: input.id,
      userId,
      deletedAt: null,
    },
  });

  if (!existing) {
    throw new Error("Source not found");
  }

  const source = await prisma.source.update({
    where: { id: input.id },
    data: {
      name: input.name,
      type: input.type,
      subtype: input.subtype,
      balance: input.balance,
      color: input.color,
      sourceNumber: input.sourceNumber,
      active: input.active,
      updatedAt: new Date(),
    },
  });

  return source as SourceDTO;
}

export async function deleteSource(
  userId: string,
  id: string,
): Promise<SourceDTO> {
  // Verify ownership
  const existing = await prisma.source.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
  });

  if (!existing) {
    throw new Error("Source not found");
  }

  // Soft delete
  const source = await prisma.source.update({
    where: { id },
    data: {
      active: false,
      deletedAt: new Date(),
    },
  });

  return source as SourceDTO;
}

export async function hardDeleteSource(
  userId: string,
  id: string,
): Promise<void> {
  // Verify ownership
  const existing = await prisma.source.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existing) {
    throw new Error("Source not found");
  }

  await prisma.source.delete({
    where: { id },
  });
}

export async function restoreSource(
  userId: string,
  id: string,
): Promise<SourceDTO> {
  // Verify ownership
  const existing = await prisma.source.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existing) {
    throw new Error("Source not found");
  }

  const source = await prisma.source.update({
    where: { id },
    data: {
      active: true,
      deletedAt: null,
      updatedAt: new Date(),
    },
  });

  return source as SourceDTO;
}
