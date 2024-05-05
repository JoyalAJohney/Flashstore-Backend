import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const postgresClient = postgres({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT!),
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
});

export const db = drizzle(postgresClient);