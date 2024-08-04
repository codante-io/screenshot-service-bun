import { z } from 'zod';

export const screenshotRequestSchema = z.object({
  url: z.string(),
});
