"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
const configure_1 = require("@core/stripe/configure");
class BillingSession {
    async execute({ data }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: data.id }
        });
        if (!user)
            throw new Error("User not found");
        const stripe = (0, configure_1.stripe)();
        const billingSession = await stripe.billingPortal.sessions.create({
            customer: user.customerId,
            return_url: 'https://stripe.com/docs/billing/subscriptions/customer-portal',
        });
        return billingSession;
    }
}
exports.default = new BillingSession();
