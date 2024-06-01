import { Hono } from "hono";
import { AuthController } from "../controller/auth.controller";


export const authRoute = new Hono();
const authController = new AuthController();

authRoute.post('/login', authController.login);
authRoute.post('/signup', authController.signUp);
authRoute.get('/login/google', authController.googleLogin);
authRoute.get('/login/google/callback', authController.googleLoginCallback);