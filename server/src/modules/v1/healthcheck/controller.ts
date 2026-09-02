// internal-imports
import { SuccessResponse } from '@/core/index.js';

// external-imports
import type { Request, Response } from 'express';

// controller for module
export const controller = {
  // @controller GET /
  checkHealth: (_request: Request, response: Response) => {
    return response.status(200).json(new SuccessResponse({ message: 'Service is healthy' }));
  },
};
