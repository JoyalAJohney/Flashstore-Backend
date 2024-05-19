import { Hono } from "hono";
import { config } from "../../common/config";
import { db as dbConn } from "../../database/connection";
import { users as userTable } from "../schema/user.schema";
import axios from "axios";
import jwt from 'jsonwebtoken';


export const authRoute = new Hono();

authRoute.get('/', async (c) => {
    console.log('Selecting Users..')
    const users = await dbConn.select().from(userTable);

    console.log('Users:', users)
    return c.json(users);
})

authRoute.get('/login/google', async (c) => {
    const googleAuthURL = 'https://accounts.google.com/o/oauth2/v2/auth'

    const { google } = config;

    const googleAuthParams = new URLSearchParams({
        client_id: google.clientID!,
        redirect_uri: google.redirectURL!,
        response_type: 'code',
        scope: 'profile email',
    });

    const googleAuthURLWithParams = `${googleAuthURL}?${googleAuthParams.toString()}`;
    return c.redirect(googleAuthURLWithParams);
});


// Handle Google OAuth Callback
authRoute.get('/login/google/callback', async (c) => {
    const code = c.req.query('code');

    if (!code) {
        return c.json({ error: 'Authorization code not provided' }, 400);
    }

    // TODO: Refactor to service layer
    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code: code,
            client_id: config.google.clientID,
            client_secret: config.google.clientSecret,
            redirect_uri: config.google.redirectURL,
            grant_type: 'authorization_code'
        });

        const { id_token, access_token } = tokenResponse.data;

        console.log('ID Token:', id_token);
        console.log('Access Token:', access_token);

        const user = jwt.decode(id_token);
        console.log('User:', user);



        const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const profile = profileResponse.data;


        // Create a user in DB if not exists
        
        // generate access token and refresh token

        // Set cookies with access token and refresh token

        // Redirect to home page/dashboard

        return c.json({ message: 'User authenticated successfull', user: profile }, 200);

    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return c.json({ error: 'Failed to exchange code for token' }, 500);
    }
});