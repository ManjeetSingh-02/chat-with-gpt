// internal-imports
import type { ErrorResponse } from '../response/error.js';

// external-imports
import type { NextFunction, Request, Response } from 'express';

// middleware function to handle errors
export function errorHandler(
  error: ErrorResponse,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  return response.status(error.code).json(error);
}
