import type z from 'zod';
import type { Request } from 'express';

export type ValidatedRequest<T extends z.ZodObject> = Request & {
  validated: z.infer<T>;
};
