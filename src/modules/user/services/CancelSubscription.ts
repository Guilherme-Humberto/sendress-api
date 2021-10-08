
// Cancelar assinatura do usuário

import { prisma } from "config/prisma"
import { stripe as Stripe } from '@core/stripe/configure'

interface Props { data: { id: number, customerId: string } }

class CancelSubscription {
    async execute({ data }: Props) {
        const user = await prisma.user.findFirst({
            where: { id: data.id, customerId: data.customerId },
            select: { customerId: true, id: true }
        })

        if (!user) throw new Error("User not found");

        const stripe = Stripe()

        const customer = await stripe.customers.retrieve(String(user.customerId))
        
        const subscription = await stripe.subscriptions.list({
            customer: customer.id
        })

        await stripe.subscriptions.del(subscription.data[0].id);

        await prisma.lead.deleteMany({ where: { userId: user.id } })
        await prisma.segment.deleteMany({ where: { userId: user.id } })
        await prisma.campaign.deleteMany({ where: { userId: user.id } })
        await prisma.sender.deleteMany({ where: { userId: user.id } })

        await prisma.user.delete({
            where: { id: user.id, customerId: user.customerId }
        })


        return { status: true }
    }
}

export default new CancelSubscription()