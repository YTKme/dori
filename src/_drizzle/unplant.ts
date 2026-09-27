/**
 * Database Unplant
 *
 * Removes the demo organization (cascades to its CRM data and members)
 * and the demo user. Run with `npm run drizzle:unplant`.
 */

import { eq } from "drizzle-orm";

import { drizzleClient, pgPool } from "./client";
import {
  betterauthOrganizationTable,
  betterauthUserTable,
} from "./schema/better-auth";

async function unplant() {
  await drizzleClient
    .delete(betterauthOrganizationTable)
    .where(eq(betterauthOrganizationTable.slug, "demo"));
  await drizzleClient
    .delete(betterauthUserTable)
    .where(eq(betterauthUserTable.email, "admin@demo.dori"));
  console.info("Removed demo data.");
}

unplant()
  .catch((error) => {
    console.error("Error unplanting:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pgPool.end();
  });
