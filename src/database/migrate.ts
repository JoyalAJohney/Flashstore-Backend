import dotenv from 'dotenv';
dotenv.config();

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";


async function runMigration() {
    console.log('Running migration...');

    const migrationClient = postgres({
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT!),
        database: process.env.POSTGRES_DATABASE,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        max: 1,
    });
  
    try {
        await migrate(drizzle(migrationClient), { 
            migrationsFolder: './src/migrations', 
            migrationsSchema: 'public', 
            migrationsTable: 'migrations' 
        });
    
        console.log('Migration complete!');
    } catch (err) {
        console.error('Migration failed: ', err);
    } finally {
        await migrationClient.end();
    }
  }
  
  runMigration();