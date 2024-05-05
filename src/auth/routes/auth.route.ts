import { Hono } from "hono";
import { db as dbConn } from "../../database/connection";
import { users as userTable } from "../schema/user.schema";


export const authRoute = new Hono();

authRoute.get('/', async (c) => {
    console.log('Selecting Users..')
    const users = await dbConn.select().from(userTable);

    console.log('Users:', users)
})