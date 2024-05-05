import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { authRoute } from './auth/routes/auth.route';

const app = new Hono();

// Middleware
app.use('*', logger());


// Health check
app.get('/health', (c) => {
    return c.json({ "message" : "Up and Running" });
});


// Routes
app.basePath('/api').route('/auth', authRoute);


export default app;