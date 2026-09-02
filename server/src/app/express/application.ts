// internal-imports
import { corsConfig, errorHandler, loadModules } from '@/core/index.js';

// external-imports
import cors from 'cors';
import express from 'express';

// function to create application
export default async function createApp() {
  // create express application
  const application = express();

  // load all modules
  await loadModules(application);

  // attach middlewares
  application
    .use(cors(corsConfig))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(errorHandler);

  // return the application
  return application;
}
