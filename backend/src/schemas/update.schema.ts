import { z } from 'zod';

export const createUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid field ID'),
  }),
  body: z.object({
    stage: z.enum(['Planted', 'Growing', 'Ready', 'Harvested']),
    notes: z.string().optional(),
  }),
});
