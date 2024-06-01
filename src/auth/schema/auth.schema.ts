import { z } from 'zod';

const userSignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type userLoginDTO = z.infer<typeof userLoginSchema>
type userSignUpDTO = z.infer<typeof userLoginSchema>

export { userSignUpSchema, userLoginSchema, userSignUpDTO, userLoginDTO };