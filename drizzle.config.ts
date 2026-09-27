/**
 * drizzle Configuration
 *
 * Environment is provided by the caller: the npm scripts wrap drizzle-kit
 * in `dotenvx run -f <env-file>`, and the docker `migrate` service injects
 * the variables directly. `configuration/drizzle` reads `process.env`.
 */

import { defineConfig } from "drizzle-kit";

import { POSTGRESQL_URI } from "./src/configuration/drizzle";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: POSTGRESQL_URI,
  },
  out: "./src/_drizzle/migration",
  schema: "./src/_drizzle/schema",
  verbose: true,
});
