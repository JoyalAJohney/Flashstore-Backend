// all variables in .env file are now available in process.env
import dotenv from 'dotenv';
dotenv.config();


import app from './app';
import { serve } from '@hono/node-server';


const appPort = parseInt(process.env.APP_PORT!) || 3000;

serve({
  port: appPort,
  fetch: app.fetch,
});

console.log(`Listening on localhost:${appPort}...`)