import { env } from '../config/env.js';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client.js';

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});
