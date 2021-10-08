import Stripe from 'stripe'
import { stripe } from './configure'

interface CheckoutProps {
    prices: Stripe.Response<Stripe.ApiList<Stripe.Price>>
    customer: string
}

const createCheckoutSession = async ({ prices: { data }, customer }: CheckoutProps) => {
    const stripeSession = stripe()

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
    })

    return session
}

export { createCheckoutSession }