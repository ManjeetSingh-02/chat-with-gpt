// internal-imports
import { ErrorResponse } from '../response/error.js';

// external-imports
import type { NextFunction, Request, Response } from 'express';

// middleware function to handle errors
export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  // check if error is an instance of ErrorResponse
  if (error instanceof ErrorResponse)
    return response.status(error.code).json({
      success: false,
      message: error.message,
      issues: error.issues,
    });

  // return a generic error response for unhandled errors
  return response.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}
