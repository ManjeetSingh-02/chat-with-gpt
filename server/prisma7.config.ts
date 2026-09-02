/// <reference types="node" />

// internal-imports
import 'dotenv/config';

// external-imports
import { defineConfig } from 'prisma/config';

// prisma configuration
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
