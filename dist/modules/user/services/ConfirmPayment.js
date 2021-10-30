"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configure_1 = require("@core/stripe/configure");
const retrieve_1 = require("@core/stripe/retrieve");
const prisma_1 = require("config/prisma");
class ConfirmPayment {
    async execute({ data, sessionId }) {
        const stripe = (0, configure_1.stripe)();
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user)
            throw new Error("User not found");
        const session = await (0, retrieve_1.retrieveSession)(sessionId);
        if (session.payment_status === 'unpaid')
            throw new Error("Error creating subscription");
        const { data: userStripe } = await stripe.customers.list({
            email: user.email
        });
        await prisma_1.prisma.user.update({
            where: { email: data.email },
            data: {
                verified: true,
                payment_status: true,
                transactionId: session.id,
                customerId: String(userStripe[0].id)
            }
        });
        await prisma_1.prisma.segment.create({
            data: { title: 'Default', userId: user.id }
        });
        return sessionId;
    }
}
exports.default = new ConfirmPayment();
