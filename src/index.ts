import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import screenshot from './routes/screenshot';
import vimeoVideo from './routes/vimeo-video';
import uploadImage from './routes/upload-image';
import uploadAvatarImage from './routes/upload-avatar-image';
import avatarPlaceholder from './routes/avatars/avatar-placeholder';
import { etag } from 'hono/etag';

const app = new Hono();

// Protected routes
app.use('/screenshot', bearerAuth({ token: process.env.TOKEN! }));
app.use('/upload-image', bearerAuth({ token: process.env.TOKEN! }));
app.use('/upload-avatar-image/*', bearerAuth({ token: process.env.TOKEN! }));

app.route('/screenshot', screenshot);
app.route('/upload-image', uploadImage);
app.route('/upload-avatar-image', uploadAvatarImage);

// Unprotected routes
app.use('/avatars/*', etag());
app.route('/avatars', avatarPlaceholder);

export default {
  port: 3012,
  fetch: app.fetch,
};
