import { prisma } from "config/prisma"
import { stripe as Stripe } from '@core/stripe/configure'

interface Request { data: { id: number, customerId: string  }}

class BillingSession {
    async execute({ data }: Request) {
        const user = await prisma.user.findUnique({
            where: { id: data.id as number }
        })

        if (!user) throw new Error("User not found")

        const stripe = Stripe()

        const billingSession = await stripe.billingPortal.sessions.create({
          customer: user.customerId,
          return_url:
            'https://stripe.com/docs/billing/subscriptions/customer-portal',
        })

        return billingSession
    }
}

export default new BillingSession()