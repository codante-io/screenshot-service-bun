import { validator } from 'hono/validator';
import { screenshotRequestSchema } from './schemas';

export function screenshotValidator() {
  return validator('json', (value, c) => {
    const parsed = screenshotRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json({ message: 'Invalid Data' }, 401);
    }
    return parsed.data;
  });
}
