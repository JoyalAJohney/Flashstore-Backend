import postgres from 'postgres';
import { config } from '../common/config/config';
import { drizzle } from 'drizzle-orm/postgres-js';

const { database } = config;

const postgresClient = postgres({
    host: database.host,
    port: database.port,
    username: database.user,
    password: database.password,
    database: database.database,
    max: 20,
});

export const db = drizzle(postgresClient);