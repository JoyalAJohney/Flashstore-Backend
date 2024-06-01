import { sign } from 'hono/jwt';
import { JWTPayload } from 'hono/utils/jwt/types';
import { config } from '../config/config';


export class UtilService {
    public static generatetoken(payload: JWTPayload) {
        return sign(payload, config.application.jwt_secret!)
    }
}