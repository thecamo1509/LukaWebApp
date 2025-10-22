"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import * as M from "@/lib/dal/sources/mutations";
import * as Q from "@/lib/dal/sources/queries";
import {
  createSourceSchema,
  type ListSourcesResponse,
  listSourcesSchema,
  type SourceResponse,
  sourceIdSchema,
  updateSourceSchema,
} from "./sources.types";

export const runtime = "nodejs";

// ============================================
// Helper Functions
// ============================================

async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: No active session");
  }
  return session.user.id;
}

// ============================================
// Query Actions
// ============================================

export async function actionListSources(
  input: unknown,
): Promise<ListSourcesResponse> {
  const userId = await getAuthenticatedUserId();
  const query = listSourcesSchema.parse(input);

  const result = await Q.listSources(userId, {
    cursor: query.cursor ?? undefined,
    limit: query.limit,
    activeOnly: query.activeOnly,
  });

  return result as ListSourcesResponse;
}

export async function actionGetSource(id: unknown): Promise<SourceResponse> {
  const userId = await getAuthenticatedUserId();
  const sourceId = sourceIdSchema.parse(id);

  const source = await Q.getSourceById(userId, sourceId);

  if (!source) {
    throw new Error("Source not found");
  }

  return source as SourceResponse;
}

export async function actionGetSourcesByType(
  type: unknown,
): Promise<SourceResponse[]> {
  const userId = await getAuthenticatedUserId();

  if (typeof type !== "string") {
    throw new Error("Invalid source type");
  }

  const sources = await Q.getSourcesByType(userId, type);
  return sources as SourceResponse[];
}

export async function actionGetTotalBalance(): Promise<number> {
  const userId = await getAuthenticatedUserId();
  return await Q.getTotalBalance(userId);
}

// ============================================
// Mutation Actions
// ============================================

export async function actionCreateSource(
  input: unknown,
): Promise<SourceResponse> {
  const userId = await getAuthenticatedUserId();
  const data = createSourceSchema.parse(input);

  const source = await M.createSource(userId, {
    name: data.name,
    type: data.type,
    subtype: data.subtype,
    balance: data.balance,
    color: data.color,
    sourceNumber: data.sourceNumber,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sources");

  return source as SourceResponse;
}

export async function actionUpdateSource(
  input: unknown,
): Promise<SourceResponse> {
  const userId = await getAuthenticatedUserId();
  const data = updateSourceSchema.parse(input);

  const source = await M.updateSource(userId, data);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sources");
  revalidatePath(`/dashboard/sources/${source.id}`);

  return source as SourceResponse;
}

export async function actionDeleteSource(id: unknown): Promise<SourceResponse> {
  const userId = await getAuthenticatedUserId();
  const sourceId = sourceIdSchema.parse(id);

  const source = await M.deleteSource(userId, sourceId);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sources");

  return source as SourceResponse;
}

export async function actionRestoreSource(
  id: unknown,
): Promise<SourceResponse> {
  const userId = await getAuthenticatedUserId();
  const sourceId = sourceIdSchema.parse(id);

  const source = await M.restoreSource(userId, sourceId);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sources");
  revalidatePath(`/dashboard/sources/${source.id}`);

  return source as SourceResponse;
}
