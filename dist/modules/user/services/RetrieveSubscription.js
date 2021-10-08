"use strict";
// Recuperar informações da assinatura do usuário
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
const configure_1 = require("@core/stripe/configure");
class RetrieveSubscription {
    async execute({ data }) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: data.id, customerId: data.customerId },
            select: { customerId: true }
        });
        if (!user)
            throw new Error("User not found");
        const stripe = (0, configure_1.stripe)();
        const customer = await stripe.customers.retrieve(String(user.customerId));
        const subscription = await stripe.subscriptions.list({
            customer: customer.id
        });
        const paymentMethod = await stripe.paymentMethods.retrieve(subscription.data[0].default_payment_method);
        const productArr = subscription.data[0].items.data;
        const product = productArr[0].plan.product;
        const productRetrieve = await stripe.products.retrieve(String(product));
        return {
            plan: subscription.data[0],
            product: productRetrieve,
            payment: paymentMethod
        };
    }
}
exports.default = new RetrieveSubscription();
