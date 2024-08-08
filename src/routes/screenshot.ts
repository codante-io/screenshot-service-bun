import { Hono } from 'hono';
import {
  screenshotPutValidator,
  screenshotValidator,
} from '../lib/hono-validators';
import { getBufferFromPageScreenshot } from '../lib/screenshot';
import { S3 } from '../lib/s3';

const app = new Hono();

app.post('/', screenshotValidator(), async (c) => {
  const { url, fileName } = c.req.valid('json');

  try {
    const screenshotBuffer = await getBufferFromPageScreenshot(url);
    const s3 = new S3();
    const { imageUrl } = await s3.uploadImage({
      path: fileName,
      buffer: screenshotBuffer,
    });

    return c.json({ message: 'Screenshot uploaded to S3', imageUrl });
  } catch (e: any) {
    return c.json({ message: e.message }, 500);
  }
});

app.put('/', screenshotPutValidator(), async (c) => {
  const { url, fileName, oldFilename } = c.req.valid('json');

  try {
    const screenshotBuffer = await getBufferFromPageScreenshot(url);
    const s3 = new S3();
    const { imageUrl } = await s3.uploadImage({
      path: fileName,
      buffer: screenshotBuffer,
    });

    // delete the old image
    await s3.deleteImage(oldFilename);

    return c.json({ message: 'Screenshot updated on S3', imageUrl });
  } catch (e: any) {
    return c.json({ message: e.message }, 500);
  }
});

export default app;
