import { z } from 'zod';
import { PaymentMethodEnum } from '../constants/payment.constant';

const MakePaymentSchema = z.object({
    orderId: z.string(),
    paymentMethod: z.nativeEnum(PaymentMethodEnum),
});

const VerifyPaymentSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
});

type MakePaymentDTO = z.infer<typeof MakePaymentSchema>;
type VerifyPaymentDTO = z.infer<typeof VerifyPaymentSchema>;

export { MakePaymentSchema, MakePaymentDTO, VerifyPaymentSchema, VerifyPaymentDTO};