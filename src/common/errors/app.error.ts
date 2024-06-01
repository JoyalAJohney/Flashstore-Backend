import { StatusCode } from "hono/utils/http-status";


export class AppError extends Error {
    public statusCode: StatusCode;

    constructor(statusCode: StatusCode, message: string) {
        super(message);
        this.statusCode = statusCode; // HTTP status code
    }
}