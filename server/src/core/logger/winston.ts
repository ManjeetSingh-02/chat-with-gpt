// internal-imports
import { APP_CONFIG } from '../config/constants.js';
import { env } from '../config/env.js';

// external-imports
import winston from 'winston';

// create logger instance
export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: APP_CONFIG.WINSTON_CONFIG.TIMESTAMP_FORMAT }),
    winston.format.errors({ stack: true }),
    winston.format.printf(
      log =>
        `(${env.NODE_ENV.toUpperCase()}) ${log.timestamp} [${log.level.toUpperCase()}]: ${log.stack ?? log.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      format:
        env.NODE_ENV === APP_CONFIG.NODE_ENVS.PRODUCTION
          ? undefined
          : winston.format.colorize({ all: true }),
    }),
  ],
});
