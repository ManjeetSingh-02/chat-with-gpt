// internal-imports
import { ErrorResponse } from '../response/error.js';

// external-imports
import z from 'zod';
import type { Request, Response, NextFunction } from 'express';

// type for validated request data
type ValidatedRequestData = {
  body: unknown;
  query: unknown;
  params: unknown;
};

// function for validating request body using zod schema
export function validateZodSchema<T extends ValidatedRequestData>(schema: z.ZodType<T>) {
  return function (request: Request, _response: Response, next: NextFunction) {
    // validate request against the provided schema
    const result = schema.safeParse({
      body: request.body,
      query: request.query,
      params: request.params,
    });

    // if validation fails
    if (!result.success)
      throw new ErrorResponse({
        code: 400,
        message: 'Invalid request data',
        issues: z.flattenError(result.error).fieldErrors,
      });

    // add validated data to request.validated
    request.validated = result.data;

    // forward request to next middleware
    next();
  };
}
