// internal-imports
import { router } from './route.js';

// external-imports
import type { Application } from 'express';

// register module routes
export default function (application: Application) {
  application.use('/api/v1/healthcheck', router);
}
