import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { account } from "../../src/_drizzle/database/account.server";
import { createTestOrg, destroyTestOrg, type TestOrg } from "../helper";

describe("account data access", () => {
  let org: TestOrg;

  beforeAll(async () => {
    org = await createTestOrg();
  });
  afterAll(async () => {
    await destroyTestOrg(org);
  });

  test("create sets tenant + owner", async () => {
    const created = await account.create({
      data: { name: "Acme" } as any,
      organizationId: org.organizationId,
      actorId: org.userId,
    });
    expect(created.name).toBe("Acme");
    expect(created.organizationId).toBe(org.organizationId);
    expect(created.ownerId).toBe(org.userId);
  });

  test("retrieve, update and expand owner", async () => {
    const created = await account.create({
      data: { name: "Globex", industry: "Tech" } as any,
      organizationId: org.organizationId,
      actorId: org.userId,
    });

    const fetched: any = await account.retrieveById({
      id: created.id,
      organizationId: org.organizationId,
      expand: ["owner"],
    });
    expect(fetched?.id).toBe(created.id);
    expect(fetched?.owner?.id).toBe(org.userId);

    const updated = await account.updateById({
      id: created.id,
      data: { industry: "Manufacturing" } as any,
      organizationId: org.organizationId,
      actorId: org.userId,
    });
    expect(updated?.industry).toBe("Manufacturing");
  });

  test("search matches by name (ILIKE)", async () => {
    await account.create({
      data: { name: "Findable Industries" } as any,
      organizationId: org.organizationId,
      actorId: org.userId,
    });
    const hit = await account.list({
      organizationId: org.organizationId,
      q: "findable",
    });
    expect(hit.total).toBeGreaterThanOrEqual(1);
    const miss = await account.list({
      organizationId: org.organizationId,
      q: "no-such-account-xyz",
    });
    expect(miss.total).toBe(0);
  });

  test("soft delete excludes from reads", async () => {
    const created = await account.create({
      data: { name: "Temporary" } as any,
      organizationId: org.organizationId,
      actorId: org.userId,
    });
    const deleted = await account.deleteById({
      id: created.id,
      organizationId: org.organizationId,
      actorId: org.userId,
    });
    expect(deleted?.deletedAt).toBeTruthy();
    const afterDelete = await account.retrieveById({
      id: created.id,
      organizationId: org.organizationId,
    });
    expect(afterDelete).toBeUndefined();
  });
});
