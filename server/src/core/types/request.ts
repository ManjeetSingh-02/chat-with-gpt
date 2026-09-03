// external-imports
import type z from 'zod';

// type for a request that has been validated
export type Validated<T extends z.ZodObject> = {
  validated: z.infer<T>;
};

// type for a request that has been authenticated
export type Authenticated = {
  user: {
    id: string;
  };
};
