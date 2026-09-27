/**
 * Database Plant (seed)
 *
 * Seeds a demo organization with a login-able owner and representative
 * CRM data. Idempotent: does nothing if the demo organization exists.
 *
 * Run with `npm run drizzle:plant`.
 */

import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";

import { seedDefaultStages } from "../server/organization-defaults.server";
import { drizzleClient, pgPool } from "./client";
import { accountTable } from "./schema/account";
import { activityTable } from "./schema/activity";
import {
  betterauthAccountTable,
  betterauthMemberTable,
  betterauthOrganizationTable,
  betterauthUserTable,
} from "./schema/better-auth";
import { campaignTable } from "./schema/campaign";
import { caseTable } from "./schema/case";
import { contactTable } from "./schema/contact";
import { leadTable } from "./schema/lead";
import { opportunityTable } from "./schema/opportunity";
import { opportunityStageTable } from "./schema/opportunity-stage";
import { priceBookTable } from "./schema/price-book";
import { productTable } from "./schema/product";

const DEMO = {
  name: "Demo Admin",
  email: "admin@demo.dori",
  username: "admin",
  password: "password123",
  organizationName: "Demo Company",
  organizationSlug: "demo",
};

async function plant() {
  console.info("Planting demo data…");

  const existing = await drizzleClient
    .select({ id: betterauthOrganizationTable.id })
    .from(betterauthOrganizationTable)
    .where(eq(betterauthOrganizationTable.slug, DEMO.organizationSlug))
    .limit(1);
  if (existing[0]) {
    console.info("Demo organization already exists — skipping.");
    return;
  }

  // Owner user + credential account (so the demo user can log in).
  const [user] = await drizzleClient
    .insert(betterauthUserTable)
    .values({
      name: DEMO.name,
      email: DEMO.email,
      username: DEMO.username,
      displayUsername: DEMO.name,
      emailVerified: true,
    })
    .returning();
  await drizzleClient.insert(betterauthAccountTable).values({
    accountId: user.id,
    providerId: "credential",
    userId: user.id,
    password: await hashPassword(DEMO.password),
  });

  // Organization + owner membership.
  const [organization] = await drizzleClient
    .insert(betterauthOrganizationTable)
    .values({
      name: DEMO.organizationName,
      slug: DEMO.organizationSlug,
      createdAt: new Date(),
    })
    .returning();
  await drizzleClient.insert(betterauthMemberTable).values({
    organizationId: organization.id,
    userId: user.id,
    role: "owner",
    createdAt: new Date(),
  });

  const base = {
    organizationId: organization.id,
    ownerId: user.id,
    createdById: user.id,
    updatedById: user.id,
  };

  await seedDefaultStages(organization.id, user.id);
  const stages = await drizzleClient
    .select()
    .from(opportunityStageTable)
    .where(eq(opportunityStageTable.organizationId, organization.id))
    .orderBy(opportunityStageTable.displayOrder);

  // Accounts
  const [acme, globex] = await drizzleClient
    .insert(accountTable)
    .values([
      {
        ...base,
        name: "Acme Corporation",
        type: "customer",
        industry: "Manufacturing",
        website: "https://acme.example.com",
        phone: "+1 555 0100",
        annualRevenue: "5000000",
        numberOfEmployees: 250,
        rating: "hot",
      },
      {
        ...base,
        name: "Globex Corporation",
        type: "prospect",
        industry: "Technology",
        website: "https://globex.example.com",
        phone: "+1 555 0200",
        annualRevenue: "12000000",
        numberOfEmployees: 800,
        rating: "warm",
      },
    ])
    .returning();

  // Contacts
  await drizzleClient.insert(contactTable).values([
    { ...base, accountId: acme.id, firstName: "Wile", lastName: "Coyote", title: "VP Operations", email: "wile@acme.example.com", phone: "+1 555 0101" },
    { ...base, accountId: globex.id, firstName: "Hank", lastName: "Scorpio", title: "CEO", email: "hank@globex.example.com", phone: "+1 555 0201" },
  ]);

  // Leads
  await drizzleClient.insert(leadTable).values([
    { ...base, firstName: "Ada", lastName: "Byron", company: "Analytical Engines", title: "Founder", email: "ada@engines.example.com", status: "new", rating: "warm", leadSource: "web" },
    { ...base, firstName: "Alan", lastName: "Turing", company: "Bombe Ltd", title: "CTO", email: "alan@bombe.example.com", status: "working", rating: "hot", leadSource: "trade_show" },
  ]);

  // Opportunities across stages
  await drizzleClient.insert(opportunityTable).values([
    { ...base, name: "Acme — Annual Contract", accountId: acme.id, stageId: stages[2]?.id, amount: "120000", probability: "50", closeDate: "2026-12-31", type: "new_business" },
    { ...base, name: "Globex — Platform License", accountId: globex.id, stageId: stages[1]?.id, amount: "80000", probability: "25", closeDate: "2026-11-15", type: "new_business" },
    { ...base, name: "Acme — Renewal", accountId: acme.id, stageId: stages[4]?.id, amount: "60000", probability: "100", closeDate: "2026-10-01", type: "renewal", isWon: true, isClosed: true },
  ]);

  // Products + price book
  await drizzleClient.insert(productTable).values([
    { ...base, name: "Starter Plan", productCode: "PLAN-START", family: "Subscriptions" },
    { ...base, name: "Enterprise Plan", productCode: "PLAN-ENT", family: "Subscriptions" },
  ]);
  await drizzleClient.insert(priceBookTable).values({
    ...base,
    name: "Standard Price Book",
    isStandard: true,
  });

  // Case
  await drizzleClient.insert(caseTable).values({
    ...base,
    subject: "Onboarding assistance needed",
    accountId: acme.id,
    status: "new",
    priority: "medium",
    origin: "email",
    type: "question",
  });

  // Campaign
  await drizzleClient.insert(campaignTable).values({
    ...base,
    name: "Q4 Product Launch",
    type: "email",
    status: "in_progress",
    budgetedCost: "20000",
    expectedRevenue: "150000",
  });

  // Activities
  await drizzleClient.insert(activityTable).values([
    { ...base, type: "call", subject: "Discovery call with Acme", accountId: acme.id, status: "open", priority: "high", dueDate: "2026-10-05" },
    { ...base, type: "task", subject: "Send proposal to Globex", accountId: globex.id, status: "open", priority: "normal", dueDate: "2026-10-10" },
  ]);

  console.info(
    `Seeded organization "${DEMO.organizationName}". Login: ${DEMO.username} / ${DEMO.password}`,
  );
}

plant()
  .then(() => {
    console.info("Planting finished.");
  })
  .catch((error) => {
    console.error("Error planting:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pgPool.end();
  });
