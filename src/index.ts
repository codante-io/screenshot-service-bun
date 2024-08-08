import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import screenshot from './routes/screenshot';
import uploadImage from './routes/upload-image';
import uploadAvatarImage from './routes/upload-avatar-image';
import avatarPlaceholder from './routes/avatars/avatar-placeholder';

const app = new Hono();

// Protected routes
app.use('/screenshot', bearerAuth({ token: process.env.TOKEN! }));
app.use('/upload-image', bearerAuth({ token: process.env.TOKEN! }));
app.use('/upload-avatar-image/*', bearerAuth({ token: process.env.TOKEN! }));

app.route('/screenshot', screenshot);
app.route('/upload-image', uploadImage);
app.route('/upload-avatar-image', uploadAvatarImage);

// Unprotected routes
app.route('/avatars', avatarPlaceholder);

export default {
  port: 3012,
  fetch: app.fetch,
};
