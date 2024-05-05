import { pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";


export const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    email: varchar('email', { length: 256 }).unique().notNull(),
    password: varchar('password', { length: 256 }),
    authProvider: varchar('auth_provider', { length: 256 }),
    authProviderId: varchar('auth_provider_id', { length: 256 }),
    name: varchar('name', { length: 256 }),
    profilePicUrl: varchar('profile_pic_url', { length: 256 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (users) => {
    return {
        emailUniqueIndex: uniqueIndex('email_unique_idx').on(users.email)
    }
})