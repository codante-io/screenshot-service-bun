import { Hono } from 'hono';
import { getBufferFromPageScreenshot } from './lib/screenshot';
import { S3 } from './lib/s3';
import { screenshotValidator } from './lib/hono-validators';
import { bearerAuth } from 'hono/bearer-auth';

const app = new Hono();
app.use('*', bearerAuth({ token: process.env.TOKEN! }));

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
    const { imageUrl } = await s3.uploadImage(data.fileName, screenshotBuffer!);
    return c.json<{ message: string; imageUrl: string }>({
      message: 'Screenshot uploaded to S3',
      imageUrl,
    });
  } catch (e: any) {
    return c.json({ message: e.message }, 500);
  }
});

export default app;
