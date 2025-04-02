import { Hono } from 'hono';
import { vimeoVideoValidator } from '../lib/hono-validators';
import { handle } from '../lib/vimeo-video-thumbnail';

const app = new Hono();

app.post('/', vimeoVideoValidator(), async (c) => {
  const { vimeoID, startTime } = c.req.valid('json');

  try {
    // Baixar o vídeo do Vimeo
    const { videoUrl } = await handle(vimeoID, startTime);

    return c.json({ message: 'Video downloaded from Vimeo', videoUrl }, 200);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return c.json(
      { message: `Error downloading the video. ${errorMessage}` },
      500
    );
  }
});

export default app;
