import { Hono } from 'hono';
import { getBufferFromPageScreenshot } from './lib/screenshot';
import { S3 } from './lib/s3';
import { validator } from 'hono/validator';
import { screenshotRequestSchema } from './lib/schemas';
import { screenshotValidator } from './lib/hono-validators';

const app = new Hono();

app.post('/', screenshotValidator(), async (c) => {
  const data = c.req.valid('json');
  const url = data.url;

  let screenshotBuffer = null;
  try {
    screenshotBuffer = await getBufferFromPageScreenshot(url);
  } catch (e: any) {
    return c.json({ message: e.message }, 500);
  }

  try {
    const s3 = new S3();
    await s3.uploadImage('screenshot1.webp', screenshotBuffer!);
  } catch (e: any) {
    return c.json({ message: e.message }, 500);
  }

  return c.json({ message: 'Screenshot uploaded to S3' });
});

export default app;
