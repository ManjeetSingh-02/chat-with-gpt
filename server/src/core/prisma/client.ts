// internal-imports
import { env } from '../config/env.js';

// external-imports
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Prisma } from './generated/client.js';

// prisma client instance
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});

// export prisma client and types
export { prisma, type Prisma };
