import { Context } from "hono";
import { AuthService } from "../service/auth.service";
import { AppError } from "../../common/errors/app.error";
import { userLoginDTO, userSignUpDTO } from "../schema/auth.schema";


export class AuthController {
    constructor(private authService: AuthService) {
        this.login = this.login.bind(this);
        this.signUp = this.signUp.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
        this.googleLoginCallback = this.googleLoginCallback.bind(this);
    }

    async signUp(c: Context) {
        const { email, password } = await c.req.json() as userSignUpDTO;
        const user = await this.authService.signUp(email, password);
        return c.json({ success: true, message: 'SignUp Successfull', data: user }, 200);
    }

    async login(c: Context) {
        const { email, password } = await c.req.json() as userLoginDTO;
        const user = await this.authService.login(email, password);
        return c.json({ success: true, message: 'Login Successfull', data: user }, 200);
    }

    async googleLogin(c: Context) {
        const googleAuthURL = this.authService.getGoogleAuthURL();
        return c.redirect(googleAuthURL);
    }

    async googleLoginCallback(c: Context) {
        const code = c.req.query('code');
        if (!code) {
            throw new AppError(400, 'Authorization code not provided');
        }

        const response = await this.authService.handleGoogleLoginCallback(code);
        return c.json({ success: true, message: 'User authenticated successfull', data: response }, 200);
    }
}