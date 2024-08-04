import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import screenshot from './routes/screenshot';

const app = new Hono();

app.use('*', bearerAuth({ token: process.env.TOKEN! }));

app.route('/screenshot', screenshot);

export default {
  port: 3012,
  fetch: app.fetch,
};
