import { z } from 'zod';

export const createFieldSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    crop_type: z.string().min(1, 'Crop type is required'),
    planting_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    assigned_agent_id: z.string().uuid('Invalid agent ID').optional().nullable(),
  }),
});

export const updateFieldSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid field ID'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    crop_type: z.string().min(1).optional(),
    planting_date: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
    assigned_agent_id: z.string().uuid('Invalid agent ID').optional().nullable(),
  }),
});
