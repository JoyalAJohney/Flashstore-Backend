import postgres from 'postgres';
import { config } from '../common/config';
import { drizzle } from 'drizzle-orm/postgres-js';

const { database } = config;

const postgresClient = postgres({
    host: database.host,
    port: database.port,
    username: database.user,
    password: database.password,
    database: database.database
});

export const db = drizzle(postgresClient);