// internal-imports
import { auth, corsConfig, errorHandler, loadModules } from '@/core/index.js';

// external-imports
import cors from 'cors';
import express from 'express';
import { toNodeHandler } from 'better-auth/node';

// function to create application
export default async function createApp() {
  // create express application
  const application = express();

  // attach middlewares
  application
    .use(cors(corsConfig))
    .all('/api/v1/auth/{*any}', toNodeHandler(auth))
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

  // load all modules
  await loadModules(application);

  // attach error handler
  application.use(errorHandler);

  // return the application
  return application;
}
