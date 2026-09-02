// internal-imports
import { env } from './env.js';

// type-imports
import type { CorsOptions } from 'cors';

// CORS configuration options
export const corsConfig: CorsOptions = {
  origin: env.WEB_ORIGINS,
  credentials: true,
} as const;
