import { stripe as Stripe } from "@core/stripe/configure";
import { retrieveSession } from "@core/stripe/retrieve";
import { prisma } from "config/prisma"

interface Request { data: { email: string }, sessionId: string }

class ConfirmPayment {
    async execute({ data, sessionId }: Request) {
        const stripe = Stripe()

        const user = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (!user) throw new Error("User not found")

        const session = await retrieveSession(sessionId)

        if (session.payment_status === 'unpaid')
            throw new Error("Error creating subscription")

        const { data: userStripe } = await stripe.customers.list({
            email: user.email
        })

        await prisma.user.update({
            where: { email: data.email },
            data: {
                verified: true,
                payment_status: true,
                transactionId: session.id,
                customerId: String(userStripe[0].id)
            }
        })

        await prisma.segment.create({
            data: { title: 'Default', userId: user.id }
        })

        return sessionId
    }
}

export default new ConfirmPayment()