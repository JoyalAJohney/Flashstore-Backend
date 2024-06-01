import { Context } from "hono";
import { AppError } from "./app.error";


export const errorHandler = (err: Error, c: Context) => {
    console.error('Error:', err);

    if (err instanceof AppError) {
        return c.json({ success: false, message: err.message }, err.statusCode);
    }

    // Unhandled error - return 500
    return c.json({ success: false, message: 'Something went wrong' }, 500);
}