// internal-imports
import { auth } from '@/core/index.js';

// external-imports
import { toNodeHandler } from 'better-auth/node';

// type-imports
import type { Application } from 'express';

// register module routes
export default function (application: Application) {
  application.all('/api/v1/auth/{*any}', toNodeHandler(auth));
}
