"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubscriptionSituation = void 0;
const configure_1 = require("@core/stripe/configure");
const prisma_1 = require("config/prisma");
const stripe = (0, configure_1.stripe)();
const getActiveSubscriptions = async (customerId) => {
    const subscriptions = await stripe.subscriptions.list({
        customer: customerId, status: 'active'
    });
    return subscriptions.data;
};
const getUsersRegisters = async () => await prisma_1.prisma.user.findMany();
const checkSubscriptionSituation = async () => {
    const users = await getUsersRegisters();
    const consultSubscription = await Promise.all(users.map(async (user) => await getActiveSubscriptions(user.customerId)));
    return consultSubscription;
};
exports.checkSubscriptionSituation = checkSubscriptionSituation;
