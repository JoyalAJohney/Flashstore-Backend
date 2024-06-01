import { Context } from "hono";
import { AuthService } from "../service/auth.service";
import { AppError } from "../../common/errors/app.error";


export class AuthController {
    private authService: AuthService;

    constructor() {
        console.log('Creating instance of AuthController')
        this.authService = new AuthService();

        this.login = this.login.bind(this);
        this.signUp = this.signUp.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
        this.googleLoginCallback = this.googleLoginCallback.bind(this);
    }

    async signUp(c: Context) {
        const { email, password } = await c.req.json();
        const user = await this.authService.signUp(email, password);
        return c.json({ message: 'SignUp Successfull', user }, 200);
    }

    async login(c: Context) {
        const { email, password } = await c.req.json();
        const user = await this.authService.login(email, password);
        return c.json({ message: 'Login Successfull', user }, 200);
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
        return c.json({ message: 'User authenticated successfull', response }, 200);
    }
}