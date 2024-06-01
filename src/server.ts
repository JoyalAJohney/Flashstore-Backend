import app from './app';
import { config } from './common/config/config';
import { serve } from '@hono/node-server';


const appPort = config.application.port;

serve({
  port: appPort,
  fetch: app.fetch,
});


console.log(`Listening on localhost:${appPort}...`)