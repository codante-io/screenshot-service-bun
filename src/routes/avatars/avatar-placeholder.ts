import { Hono } from 'hono';

const app = new Hono();

app.get('/sm', async (c) => {
  // get a random integer avatar from /img/avatar-placeholder/sm-avif (1-10)
  const randomInt = Math.floor(Math.random() * 10) + 1;
  const avatarUrl = `${process.env.CODANTE_ASSETS_BASE_URL}/img/avatar-placeholders/sm-avif/${randomInt}.avif`;

  // get file from the url
  const res = await fetch(avatarUrl);

  if (!res.ok) {
    return c.json({ message: 'Failed to fetch image' }, 500);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  // return the image as response
  const response = new Response(buffer, {
    headers: {
      'Content-Type': 'image/avif',
      'Cache-Control': 'public, max-age=10368000',
    },
  });
  return response;
});

export default app;
