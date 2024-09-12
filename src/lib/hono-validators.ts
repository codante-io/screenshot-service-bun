import { validator } from 'hono/validator';
import {
  imageRequestSchema,
  screenshotPutRequestSchema,
  screenshotRequestSchema,
  vimeoVideoRequestSchema,
} from './schemas';

export function screenshotValidator() {
  return validator('json', (value, c) => {
    const parsed = screenshotRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        { message: 'Invalid Data. You need to pass `url` and `fileName`' },
        400
      );
    }
    return parsed.data;
  });
}

export function imageRequestValidator() {
  return validator('form', (value, c) => {
    const parsed = imageRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        {
          message: parsed.error.errors,
        },
        400
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
        400
      );
    }
    return parsed.data;
  });
}

export function vimeoVideoValidator() {
  return validator('json', (value, c) => {
    const parsed = vimeoVideoRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        {
          message: 'Invalid Data. You need to pass `vimeoID`',
        },
        400
      );
    }
    return parsed.data;
  });
}
