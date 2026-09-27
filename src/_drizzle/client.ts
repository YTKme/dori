/**
 * Database Client
 *
 * A single pooled drizzle client used across the application, wired with
 * the central relations registry so the `.query` API is available for
 * every table.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";

import { POSTGRESQL_URI } from "../configuration/drizzle";
import { relation } from "./relation";

// A one-off client used by seed / maintenance scripts.
const pgClient = new Client({
  connectionString: POSTGRESQL_URI,
});

// The pool backing the application at runtime.
const pgPool = new Pool({
  connectionString: POSTGRESQL_URI,
  max: 10,
});

const drizzleClient = drizzle({
  client: pgPool,
  relations: relation,
  logger: process.env.NODE_ENV === "development",
});

export { drizzleClient, pgClient, pgPool };
export type DrizzleClient = typeof drizzleClient;
