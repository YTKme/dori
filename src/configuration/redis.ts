/**
 * Redis Configuration
 */

import * as z from "zod";

let REDIS_URI: string;

const RedisSchema = z.object({
  DORI_REDIS_SCHEME: z.string().default("redis"),
  DORI_REDIS_HOST: z.string(),
  DORI_REDIS_PORT: z.coerce.number().default(6379),
  DORI_REDIS_USERNAME: z.string().default("default"),
  // Optional so a password-less local Redis works; production must set it.
  DORI_REDIS_PASSWORD: z.string().default(""),
});

type RedisSchema = z.infer<typeof RedisSchema>;

try {
  RedisSchema.parse(process.env);

  const scheme = process.env.DORI_REDIS_SCHEME ?? "redis";
  const host = process.env.DORI_REDIS_HOST;
  const port = process.env.DORI_REDIS_PORT ?? "6379";
  const username = process.env.DORI_REDIS_USERNAME ?? "default";
  const password = process.env.DORI_REDIS_PASSWORD ?? "";

  // Redis Uniform Resource Identifier (URI)
  // SCHEME://[USERNAME:PASSWORD@]HOST:PORT
  // Credentials are omitted when no password is configured so that a
  // password-less (development) Redis does not receive an AUTH command.
  const credentials = password ? `${username}:${password}@` : "";
  REDIS_URI = `${scheme}://${credentials}${host}:${port}`;
} catch (error) {
  if (error instanceof z.ZodError) {
    let message = "\nMissing Required Environment Variable:\n";
    error.issues.forEach((issue) => {
      message += `- ${issue.path}: ${issue.message}\n`;
    });
    const errorMessage = new Error(message);
    errorMessage.stack = "";
    throw errorMessage;
  } else {
    console.error(`Unexpected Error: ${error}`);
  }
}

export {
  REDIS_URI,
  RedisSchema
};
