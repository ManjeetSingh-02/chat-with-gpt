// external-imports
import type z from 'zod';
import type { Request } from 'express';

// type for a request that has been validated using Zod
export type ValidatedRequest<T extends z.ZodObject> = Request & {
  validated: z.infer<T>;
};
