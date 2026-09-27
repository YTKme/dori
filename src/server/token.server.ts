/**
 * Personal Access Token helpers.
 *
 * Tokens are shown to the user once and only their SHA-256 hash is
 * persisted. Format: `dori_pat_<base64url(32 bytes)>`.
 */

import crypto from "node:crypto";

const TOKEN_PREFIX = "dori_pat_";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function isAccessToken(value: string): boolean {
  return value.startsWith(TOKEN_PREFIX);
}

function generateAccessToken(): {
  token: string;
  hash: string;
  prefix: string;
  lastFour: string;
} {
  const random = crypto.randomBytes(32).toString("base64url");
  const token = `${TOKEN_PREFIX}${random}`;
  return {
    token,
    hash: hashToken(token),
    prefix: token.slice(0, TOKEN_PREFIX.length + 6),
    lastFour: token.slice(-4),
  };
}

export { generateAccessToken, hashToken, isAccessToken, TOKEN_PREFIX };
