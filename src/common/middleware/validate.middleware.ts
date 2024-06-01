import { z } from "zod";
import { MiddlewareHandler } from "hono";


export const validate = (schema: z.ZodSchema<any>): MiddlewareHandler => {
    return async (c: any, next: any) => {
        try {
            const data = await c.req.json();
            schema.parse(data);
            return next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }));
                return c.json({ success: false, message: 'Validation failed', errors: errors }, 400);
            } else {
                console.log('Error:', error);
                return c.json({ success: false, message: 'Internal server error' }, 500);
            }
        }
    }
}