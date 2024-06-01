import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { authRoute } from './auth/routes/auth.route';
import { errorHandler } from './common/errors/error.handler';

const app = new Hono().basePath('/api');

// Middleware
app.use('*', logger());

// Health check
app.get('/health', (c) => {
    return c.json({ "message" : "Up and Running" });
});

// Global error handler
app.onError(errorHandler);

// Routes
app.route('/auth', authRoute);


export default app;