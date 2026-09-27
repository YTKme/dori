/**
 * Global Configuration
 *
 * Unlike a value derived from `npm_package_name` (which is not present
 * when the built server runs via `node .output/server/index.mjs`), these
 * prefixes fall back to stable literals so the appliance behaves the same
 * in development and in production containers.
 */

const TABLE_PREFIX = process.env.DORI_TABLE_PREFIX ?? "dori_";

const KEY_PREFIX = process.env.DORI_KEY_PREFIX ?? "dori:";

export {
  KEY_PREFIX,
  TABLE_PREFIX
};
