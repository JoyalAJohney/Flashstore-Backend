import dotenv from 'dotenv';
dotenv.config()

import type { Config } from 'drizzle-kit';

export default {
  schema: './src/**/entities/*.entity.ts',
  out: './src/migrations',
  driver: 'pg', 
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE!,
  },
} satisfies Config;