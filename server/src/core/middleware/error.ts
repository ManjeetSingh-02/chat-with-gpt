// internal-imports
import type { IErrorResponse } from '../types/response.js';

// external-imports
import type { NextFunction, Request, Response } from 'express';

// middleware function to handle errors
export function errorHandler(
  error: IErrorResponse,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  return response.status(error.code).json(error);
}
