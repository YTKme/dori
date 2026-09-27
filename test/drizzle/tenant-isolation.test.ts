import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { account } from "../../src/_drizzle/database/account.server";
import { contact } from "../../src/_drizzle/database/contact.server";
import { createTestOrg, destroyTestOrg, type TestOrg } from "../helper";

describe("cross-tenant isolation", () => {
  let orgA: TestOrg;
  let orgB: TestOrg;

  beforeAll(async () => {
    orgA = await createTestOrg();
    orgB = await createTestOrg();
  });
  afterAll(async () => {
    await destroyTestOrg(orgA);
    await destroyTestOrg(orgB);
  });

  test("org B cannot see, read, update or delete org A's records", async () => {
    const record = await account.create({
      data: { name: "Org A Secret" } as any,
      organizationId: orgA.organizationId,
      actorId: orgA.userId,
    });

    // List is scoped.
    const listB = await account.list({ organizationId: orgB.organizationId });
    expect(listB.data.find((row) => row.id === record.id)).toBeUndefined();

    // Read is scoped.
    const readB = await account.retrieveById({
      id: record.id,
      organizationId: orgB.organizationId,
    });
    expect(readB).toBeUndefined();

    // Update is scoped (no-op).
    const updateB = await account.updateById({
      id: record.id,
      data: { name: "Hijacked" } as any,
      organizationId: orgB.organizationId,
      actorId: orgB.userId,
    });
    expect(updateB).toBeUndefined();

    // Delete is scoped (no-op).
    const deleteB = await account.deleteById({
      id: record.id,
      organizationId: orgB.organizationId,
      actorId: orgB.userId,
    });
    expect(deleteB).toBeUndefined();

    // Org A still sees the untouched record.
    const readA = await account.retrieveById({
      id: record.id,
      organizationId: orgA.organizationId,
    });
    expect(readA?.name).toBe("Org A Secret");
  });

  test("counts are per-tenant", async () => {
    await contact.create({
      data: { lastName: "Alpha" } as any,
      organizationId: orgA.organizationId,
      actorId: orgA.userId,
    });
    const a = await contact.list({ organizationId: orgA.organizationId });
    const b = await contact.list({ organizationId: orgB.organizationId });
    expect(a.total).toBeGreaterThanOrEqual(1);
    expect(b.total).toBe(0);
  });
});
