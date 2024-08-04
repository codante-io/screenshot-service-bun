import { validator } from 'hono/validator';
import { screenshotPutRequestSchema, screenshotRequestSchema } from './schemas';

export function screenshotValidator() {
  return validator('json', (value, c) => {
    const parsed = screenshotRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        { message: 'Invalid Data. You need to pass `url` and `fileName`' },
        401
      );
    }
    return parsed.data;
  });
}

export function screenshotPutValidator() {
  return validator('json', (value, c) => {
    const parsed = screenshotPutRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        {
          message:
            'Invalid Data. You need to pass `url`, `fileName` and `imageUrlToDelete`',
        },
        401
      );
    }
    return parsed.data;
  });
}
