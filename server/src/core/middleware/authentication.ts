// internal-imports
import { auth } from '../lib/auth.js';
import { ErrorResponse } from '../response/error.js';

// external-imports
import { fromNodeHeaders } from 'better-auth/node';
import type { Request, Response, NextFunction } from 'express';

// middleware function to check if the user is authenticated
export async function authenticate(request: Request, _: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });

  if (!session)
    throw new ErrorResponse({
      code: 401,
      message: 'Unauthorized',
    });

  request.user = {
    id: session.user.id,
  };

  next();
}
