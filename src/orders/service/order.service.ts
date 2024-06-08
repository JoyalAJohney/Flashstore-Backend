import Razorpay from "razorpay";
import { config } from "../../common/config/config";
import { Orders } from "razorpay/dist/types/orders";
import { VerifyPaymentDTO } from "../schema/payment.schema";
import { SlackChannel } from "../../notification/slack.constant";
import { sendSlackNotification } from "../../notification/slack.notification";
import { RazorpayVerifyPayment, validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";


const { razorpay } = config;


export class OrderService {
    private razorpayClient; 

    constructor() {
        this.razorpayClient = new Razorpay({
            key_id: razorpay.keyId!,
            key_secret: razorpay.keySecret,
        })
    }

    async makeOnlinePayment(orderId: string) {       
        // Dummy Order - Replace with actual order details
        const order = {
            id: orderId,
            amount: 5,
            currency: 'INR',
        }
        return this.generateRazorPayOrder(order);
    }

    async generateRazorPayOrder(order: any): Promise<Orders.RazorpayOrder> {
        console.log('Generating Razorpay order');
        const razorpayOrder = await this.razorpayClient.orders.create({
            receipt: order.id,
            currency: 'INR',
            amount: order.amount * 100,
        });
        return razorpayOrder;
    }

    async verifyPayment(data: VerifyPaymentDTO) {        
        const payload: RazorpayVerifyPayment = {
            order_id: data.razorpay_order_id,
            payment_id: data.razorpay_payment_id
        }
        const signature = data.razorpay_signature;
        const isValid = validatePaymentVerification(payload, signature, razorpay.keySecret!);

        if (isValid) {
            console.log('Payment verified!');
            // Need to update the order status in the database
            sendSlackNotification(SlackChannel.PAYMENTS, 'Payment is Successfull 🎉')
        }
        return isValid;
    }
}