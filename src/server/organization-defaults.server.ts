/**
 * Defaults seeded for every new organization (tenant).
 */

import { drizzleClient } from "../_drizzle/client";
import { opportunityStageTable } from "../_drizzle/schema/opportunity-stage";

const DEFAULT_STAGES = [
  { name: "Qualification", displayOrder: 1, probability: "10", forecastCategory: "pipeline" },
  { name: "Needs Analysis", displayOrder: 2, probability: "25", forecastCategory: "pipeline" },
  { name: "Proposal", displayOrder: 3, probability: "50", forecastCategory: "best_case" },
  { name: "Negotiation", displayOrder: 4, probability: "75", forecastCategory: "commit" },
  {
    name: "Closed Won",
    displayOrder: 5,
    probability: "100",
    forecastCategory: "closed",
    isWon: true,
    isClosed: true,
  },
  {
    name: "Closed Lost",
    displayOrder: 6,
    probability: "0",
    forecastCategory: "closed",
    isClosed: true,
  },
] as const;

async function seedDefaultStages(
  organizationId: string,
  userId?: string | null,
): Promise<void> {
  await drizzleClient.insert(opportunityStageTable).values(
    DEFAULT_STAGES.map((stage) => ({
      ...stage,
      organizationId,
      ownerId: userId ?? null,
      createdById: userId ?? null,
      updatedById: userId ?? null,
    })),
  );
}

export { seedDefaultStages };
