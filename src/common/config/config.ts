// Central place to read all the configuration variables to memory
import dotenv from 'dotenv';
dotenv.config();


export const config = {
    application: {
        port: parseInt(process.env.APP_PORT!),
        environment: process.env.ENV,
        jwt_secret: process.env.JWT_SECRET
    },
    database: {
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT!),
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
    },
    cache: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
        ttl: process.env.REDIS_TTL,
    },
    google: {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirectURL: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
    },
    slack: {
        bot_token: process.env.SLACK_BOT_TOKEN,
    }
}