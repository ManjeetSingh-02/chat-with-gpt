// internal-imports
import { APP_CONFIG } from './constants.js';

// external-imports
import 'dotenv/config';
import z from 'zod';

// zod schema for environment variables
const envSchema = z.object({
  WEB_ORIGINS: z
    .string()
    .transform(v => v.split(',').map(o => o.trim()))
    .pipe(z.array(z.url({ error: 'Every WEB_ORIGIN must be a valid URL' }))),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.url({ error: 'DATABASE_URL must be a valid URL' }),
  NODE_ENV: z.enum(Object.values(APP_CONFIG.NODE_ENVS)),
  BETTER_AUTH_SECRET: z.string().min(32, { error: 'BETTER_AUTH_SECRET must be at least 32 chars' }),
  BETTER_AUTH_URL: z.url({ message: 'BETTER_AUTH_URL must be a valid URL' }),
  GOOGLE_CLIENT_ID: z.string().nonempty({ error: 'GOOGLE_CLIENT_ID is required' }),
  GOOGLE_CLIENT_SECRET: z.string().nonempty({ error: 'GOOGLE_CLIENT_SECRET is required' }),
  OPENAI_API_KEY: z.string().nonempty({ error: 'OPENAI_API_KEY is required' }),
});

// function to validate environment variables
function validateEnv() {
  try {
    // parse environment variables
    return envSchema.parse(process.env);
  } catch (error: unknown) {
    // if zod error, format and throw a new error with all issues
    if (error instanceof z.ZodError) throw new Error(z.prettifyError(error), { cause: error });

    // if it's not a zod error, rethrow it
    throw error;
  }
}

// export the validated environment variables
export const env = validateEnv();
