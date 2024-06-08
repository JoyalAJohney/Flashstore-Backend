import { Context } from "hono";
import { OrderService } from "../service/order.service";
import { PaymentMethodEnum } from "../constants/payment.constant";
import { MakePaymentDTO, VerifyPaymentDTO } from "../schema/payment.schema";


export class OrderController {
    constructor(private orderService: OrderService) {
        this.makePayment = this.makePayment.bind(this);
        this.verifyPayment = this.verifyPayment.bind(this);
    }

    async makePayment(c: Context) {
        const { orderId, paymentMethod } = await c.req.json() as MakePaymentDTO;
        if (paymentMethod === PaymentMethodEnum.CASH_ON_DELIVERY) {
            console.log('COD request received for order:', orderId);
            return c.json({ success: false, message: 'Cash On Delivery is not supported yet.' });
        }
        
        const razorpayOrder = await this.orderService.makeOnlinePayment(orderId);
        return c.json({ success: true, data: { razorpay_order_id: razorpayOrder.id } });
    }

    async verifyPayment(c: Context) {
        const data = await c.req.parseBody() as VerifyPaymentDTO;
        const isValid = await this.orderService.verifyPayment(data);
        if (isValid) {
            return c.json({ success: true, message: 'Payment is successfull' });
        } else {
            return c.json({ success: false, message: 'Payment is invalid' });
        }
    }
}