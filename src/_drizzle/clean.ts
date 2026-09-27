/**
 * Database Clean
 *
 * DANGER: truncates all application data (identity + CRM). Intended for
 * development resets and the test harness only.
 */

import { sql } from "drizzle-orm";

import { drizzleClient, pgPool } from "./client";

async function clean() {
  // Truncating the root identity tables cascades to every table that
  // references them (sessions, members, and all tenant-scoped CRM tables).
  await drizzleClient.execute(
    sql`TRUNCATE TABLE betterauth_user, betterauth_organization CASCADE`,
  );
  console.info("All application data truncated.");
}

clean()
  .catch((error) => {
    console.error("Error cleaning:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pgPool.end();
  });
