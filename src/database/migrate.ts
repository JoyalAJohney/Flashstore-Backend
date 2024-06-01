import postgres from "postgres";
import { config } from "../common/config/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";


async function runMigration() {
    console.log('Running migration...');

    const { database } = config;

    const migrationClient = postgres({
        host: database.host,
        port: database.port,
        database: database.database,
        username: database.user,
        password: database.password,
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