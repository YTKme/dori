/**
 * Application Configuration
 *
 * The public base URL is required by better-auth for cookies, callbacks
 * and trusted origins. It can be provided directly via
 * `DORI_APPLICATION_URL` or composed from its parts.
 */

const APPLICATION_SCHEME = process.env.DORI_APPLICATION_SCHEME ?? "http";
const APPLICATION_HOST = process.env.DORI_APPLICATION_HOST ?? "localhost";
const APPLICATION_PORT = process.env.DORI_APPLICATION_PORT ?? "3000";

const APPLICATION_BASE_URL = process.env.DORI_APPLICATION_URL
  ?? `${APPLICATION_SCHEME}://${APPLICATION_HOST}:${APPLICATION_PORT}`;

export {
  APPLICATION_BASE_URL,
  APPLICATION_HOST,
  APPLICATION_PORT,
  APPLICATION_SCHEME
};
