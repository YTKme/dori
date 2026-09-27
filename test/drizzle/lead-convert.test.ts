import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { lead } from "../../src/_drizzle/database/lead.server";
import { convertLead } from "../../src/server/lead-convert.server";
import { createTestOrg, destroyTestOrg, type TestOrg } from "../helper";

describe("lead conversion", () => {
  let org: TestOrg;

  beforeAll(async () => {
    org = await createTestOrg();
  });
  afterAll(async () => {
    await destroyTestOrg(org);
  });

  test("converts a lead into account + contact + opportunity", async () => {
    const created = await lead.create({
      data: {
        firstName: "Grace",
        lastName: "Hopper",
        company: "Compiler Co",
        email: "grace@compiler.example.com",
      } as any,
      organizationId: org.organizationId,
      actorId: org.userId,
    });

    const result = await convertLead({
      id: created.id,
      organizationId: org.organizationId,
      actorId: org.userId,
      opportunityName: "Compiler Co — New Deal",
    });

    expect(result.account.name).toBe("Compiler Co");
    expect(result.contact.lastName).toBe("Hopper");
    expect(result.contact.accountId).toBe(result.account.id);
    expect(result.opportunity?.name).toBe("Compiler Co — New Deal");
    expect(result.lead.isConverted).toBe(true);
    expect(result.lead.convertedAccountId).toBe(result.account.id);
  });

  test("a converted lead cannot be converted again", async () => {
    const created = await lead.create({
      data: { lastName: "Once", company: "Single Shot" } as any,
      organizationId: org.organizationId,
      actorId: org.userId,
    });
    await convertLead({
      id: created.id,
      organizationId: org.organizationId,
      actorId: org.userId,
    });
    await expect(
      convertLead({
        id: created.id,
        organizationId: org.organizationId,
        actorId: org.userId,
      }),
    ).rejects.toThrow(/already converted/i);
  });
});
