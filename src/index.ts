import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import screenshot from './routes/screenshot';
import vimeoVideo from './routes/vimeo-video';
import uploadImage from './routes/upload-image';
import uploadAvatarImage from './routes/upload-avatar-image';

const app = new Hono();

app.use('*', bearerAuth({ token: process.env.TOKEN! }));

app.route('/screenshot', screenshot);
// app.route('/vimeo-video', vimeoVideo);
app.route('/upload-image', uploadImage);
app.route('/upload-avatar-image', uploadAvatarImage);

export default {
  port: 3012,
  fetch: app.fetch,
};
