import { z } from 'zod';

export const screenshotRequestSchema = z.object({
  url: z.string(),
  fileName: z
    .string({ message: 'fileName must be a string' })
    .min(1, 'fileName is required'),
});

export const screenshotPutRequestSchema = z.object({
  url: z.string(),
  fileName: z
    .string({ message: 'fileName must be a string' })
    .min(1, 'fileName is required'),
  oldFilename: z.string().min(1, 'oldFilename is required'),
});
