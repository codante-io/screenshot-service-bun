import { z } from 'zod';

export const screenshotRequestSchema = z.object({
  url: z.string(),
  fileName: z
    .string({ message: 'fileName must be a string' })
    .min(1, 'fileName is required'),
});
