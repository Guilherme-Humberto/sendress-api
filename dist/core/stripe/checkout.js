"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const configure_1 = require("./configure");
const createCheckoutSession = async ({ prices: { data }, customer }) => {
    const stripeSession = (0, configure_1.stripe)();
    const session = await stripeSession.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: customer,
        line_items: [
            {
                price: String(data[0].id),
                quantity: 1
            },
        ],
        success_url: `http://localhost:3333/user/confirm?session_id={CHECKOUT_SESSION_ID}&customer=${customer}`,
        cancel_url: 'https://example.com/cancel',
    });
    return session;
};
exports.createCheckoutSession = createCheckoutSession;
