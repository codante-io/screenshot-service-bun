import { Hono } from 'hono';
import sharp from 'sharp';
import { imageRequestValidator } from '../lib/hono-validators';
import { S3 } from '../lib/s3';

const app = new Hono();

app.post('/', imageRequestValidator(), async (c) => {
  const { submission_image, submission_path } = c.req.valid('form');

  const imageArrBuffer = await submission_image.arrayBuffer();
  const imageBuffer = Buffer.from(imageArrBuffer);

  // resize image
  const resizedImageBuffer = await sharp(imageBuffer)
    .resize(1920, 1080, { fit: 'cover', withoutEnlargement: true })
    .toFormat('webp')
    .webp({ quality: 80 })
    .toBuffer();

  try {
    const s3 = new S3();
    const { imageUrl } = await s3.uploadImage({
      path: submission_path,
      buffer: resizedImageBuffer,
      contentType: 'image/webp',
    });

    return c.json({ message: 'Screenshot uploaded to S3', imageUrl });
  } catch (e: any) {
    return c.json({ message: e.message }, 500);
  }
});

export default app;
