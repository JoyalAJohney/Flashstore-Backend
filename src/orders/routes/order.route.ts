import { Hono } from "hono";
import { OrderController } from "../controller/order.controller";
import { validate, validateFormData } from "../../common/middleware/validate.middleware";
import { MakePaymentSchema, VerifyPaymentSchema } from "../schema/payment.schema";
import { OrderService } from "../service/order.service";

export const orderRoute = new Hono();

const orderService = new OrderService();
const orderController = new OrderController(orderService);

// Payments
orderRoute.post('/make-payment', validate(MakePaymentSchema), orderController.makePayment);
orderRoute.post('/verify-payment', validateFormData(VerifyPaymentSchema), orderController.verifyPayment);