import axios from "axios";
import bcrypt from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { decode } from "hono/jwt";
import { v4 as uuidv4 } from 'uuid';
import { config } from "../../common/config/config";
import { db } from "../../database/connection";
import { JWTPayload } from "hono/utils/jwt/types";
import { UserEntity, users } from "../entities/user.entity"
import { AuthProvider } from "../constants/auth.constant";
import { UtilService } from "../../common/utils/util";
import { AppError } from "../../common/errors/app.error";


export class AuthService {

    async signUp(email: string, password: string): Promise<UserEntity> {      
        const [existingUser] = await db.select().from(users)
            .where(sql`${users.email} = ${email} AND ${users.authProvider} = ${AuthProvider.SYSTEM}`);

        if (existingUser) {
            throw new AppError(400, 'User with this email already exists');
        }
        
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser: UserEntity = {
            id: uuidv4(),
            email: email,
            password: hashedPassword,
            createdAt: new Date(),
            authProvider: AuthProvider.SYSTEM,
        };

        await db.insert(users).values(newUser);
        return newUser;
    }

    async login(email: string, password: string) {
        const [user] = await db.select().from(users)
        .where(sql`${users.email} = ${email} AND ${users.authProvider} = ${AuthProvider.SYSTEM}`);
        
        if (!user || !bcrypt.compareSync(password, user.password!)) {
            throw new AppError(401, 'Invalid email or password');
        }

        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);

        return { accessToken, refreshToken, user };
    }


    // __________________Google Login___________________
    getGoogleAuthURL(): string {
        const googleAuthURL = 'https://accounts.google.com/o/oauth2/v2/auth'
        const { google } = config;

        const googleAuthParams = new URLSearchParams({
            response_type: 'code',
            scope: 'profile email',
            client_id: google.clientID!,
            redirect_uri: google.redirectURL!,
        });

        return `${googleAuthURL}?${googleAuthParams.toString()}`;
    }

    async handleGoogleLoginCallback(code: string) {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
                code: code,
                client_id: config.google.clientID,
                client_secret: config.google.clientSecret,
                redirect_uri: config.google.redirectURL,
                grant_type: 'authorization_code'
            });
    
            const { id_token } = tokenResponse.data;
            const { payload } = decode(id_token);

            if (!payload) {
                throw new Error('Failed to decode token');
            }

            const result = await db.select().from(users).where(eq(users.email, payload.email as string));
            let dbUser: UserEntity = result[0]

            if (!dbUser) {
                dbUser = {
                    id: uuidv4(),
                    email: payload.email as string,
                    name: payload.name as string,
                    authProviderId: payload.sub as string,
                    profilePicUrl: payload.picture as string,
                    authProvider: AuthProvider.GOOGLE,
                    createdAt: new Date(),
                }
                await db.insert(users).values(dbUser);
            }

            const accessToken = await this.generateAccessToken(dbUser);
            const refreshToken = await this.generateRefreshToken(dbUser);
            
            return { accessToken, refreshToken, user: dbUser };
    }


    // _________________Helper methods____________________
    generateAccessToken(user: UserEntity): Promise<string> {
        const issuedAt = Math.floor(Date.now() / 1000);
        const payload: JWTPayload = {
            iat: issuedAt,
            sub: user.id,
            email: user.email,
            iss: 'flashstore_ecomm',
            exp: issuedAt + (2 * 60 * 60), // 2 hours
        }
        return UtilService.generatetoken(payload);
    }

    generateRefreshToken(user: UserEntity): Promise<string> {
        const issuedAt = Math.floor(Date.now() / 1000);
        const payload: JWTPayload = {
            iat: issuedAt,
            sub: user.id,
            iss: 'flashstore_ecomm',
            exp: issuedAt + (7 * 24 * 60 * 60), // 7 days
        }
        return UtilService.generatetoken(payload);
    }
}