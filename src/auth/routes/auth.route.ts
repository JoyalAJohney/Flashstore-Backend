import { Hono } from "hono";
import { AuthService } from "../service/auth.service";
import { AuthController } from "../controller/auth.controller";
import { userLoginSchema, userSignUpSchema } from "../schema/auth.schema";
import { validate } from "../../common/middleware/validate.middleware";


export const authRoute = new Hono();

const authService = new AuthService();
const authController = new AuthController(authService);

authRoute.get('/login/google', authController.googleLogin);
authRoute.get('/login/google/callback', authController.googleLoginCallback);

authRoute.post('/login', validate(userLoginSchema), authController.login)
authRoute.post('/signup', validate(userSignUpSchema), authController.signUp);