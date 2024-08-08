import { Hono } from 'hono';
import sharp from 'sharp';
import { S3 } from '../lib/s3';

const app = new Hono();

app.post('/', async (c) => {
  // get json data
  const json = await c.req.json();
  const avatarUrl = json.avatar_url;
  const email = json.email;

  if (!avatarUrl || !email) {
    return c.json(
      { message: 'Invalid Data. You need to pass `avatar_url` and `user_id`' },
      400
    );
  }

  const encodedEmail = Buffer.from(email).toString('base64');

  const smImgPath = `user-avatars/${encodedEmail}.avif`;
  const lgImgPath = `user-avatars/${encodedEmail}-lg.avif`;

  const res = await fetch(avatarUrl);
  const buffer = Buffer.from(await res.arrayBuffer());

  // resize image
  const lgImgBuffer = await sharp(buffer)
    .resize(800, 800, { fit: 'cover', withoutEnlargement: true })
    .avif({ quality: 80 })
    .toBuffer();

  // resize image
  const smImgBuffer = await sharp(buffer)
    .resize(200, 200, { fit: 'cover', withoutEnlargement: true })
    .avif({ quality: 80 })
    .toBuffer();

  try {
    const s3 = new S3();
    const { imageUrl: lgImageUrl } = await s3.uploadImage({
      path: lgImgPath,
      buffer: lgImgBuffer,
      contentType: 'image/avif',
    });

    const { imageUrl: smImageUrl } = await s3.uploadImage({
      path: smImgPath,
      buffer: smImgBuffer,
      contentType: 'image/avif',
    });

    return c.json({
      message: 'Screenshot uploaded to S3',
      lgImageUrl,
      smImageUrl,
    });
  } catch (e: any) {
    return c.json({ message: e.message }, 500);
  }
});

export default app;
