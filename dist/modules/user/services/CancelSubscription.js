"use strict";
// Cancelar assinatura do usuário
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
const configure_1 = require("@core/stripe/configure");
class CancelSubscription {
    async execute({ data }) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: data.id, customerId: data.customerId },
            select: { customerId: true, id: true }
        });
        if (!user)
            throw new Error("User not found");
        const stripe = (0, configure_1.stripe)();
        const customer = await stripe.customers.retrieve(String(user.customerId));
        const subscription = await stripe.subscriptions.list({
            customer: customer.id
        });
        await stripe.subscriptions.del(subscription.data[0].id);
        await prisma_1.prisma.lead.deleteMany({ where: { userId: user.id } });
        await prisma_1.prisma.segment.deleteMany({ where: { userId: user.id } });
        await prisma_1.prisma.campaign.deleteMany({ where: { userId: user.id } });
        await prisma_1.prisma.sender.deleteMany({ where: { userId: user.id } });
        await prisma_1.prisma.user.delete({
            where: { id: user.id, customerId: user.customerId }
        });
        return { status: true };
    }
}
exports.default = new CancelSubscription();
