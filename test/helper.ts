/**
 * Test helpers: create and tear down isolated organizations (tenants).
 */

import { eq } from "drizzle-orm";

import { drizzleClient } from "../src/_drizzle/client";
import {
  betterauthMemberTable,
  betterauthOrganizationTable,
  betterauthUserTable,
} from "../src/_drizzle/schema/better-auth";

export type TestOrg = { organizationId: string; userId: string };

export async function createTestOrg(): Promise<TestOrg> {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const [user] = await drizzleClient
    .insert(betterauthUserTable)
    .values({
      name: "Test User",
      email: `test-${stamp}@example.com`,
      username: `user-${stamp}`,
    })
    .returning();
  const [organization] = await drizzleClient
    .insert(betterauthOrganizationTable)
    .values({ name: `Org ${stamp}`, slug: `org-${stamp}`, createdAt: new Date() })
    .returning();
  await drizzleClient.insert(betterauthMemberTable).values({
    organizationId: organization.id,
    userId: user.id,
    role: "owner",
    createdAt: new Date(),
  });
  return { organizationId: organization.id, userId: user.id };
}

export async function destroyTestOrg(org: TestOrg): Promise<void> {
  await drizzleClient
    .delete(betterauthOrganizationTable)
    .where(eq(betterauthOrganizationTable.id, org.organizationId));
  await drizzleClient
    .delete(betterauthUserTable)
    .where(eq(betterauthUserTable.id, org.userId));
}
