
// Recuperar informações da assinatura do usuário

import { prisma } from "config/prisma"
import { stripe as Stripe } from '@core/stripe/configure'

interface Props { data: { id: number, customerId: string } }

class RetrieveSubscription {
    async execute({ data }: Props) {
        const user = await prisma.user.findFirst({
            where: { id: data.id, customerId: data.customerId },
            select: { customerId: true }
        })

        if (!user) throw new Error("User not found");

        const stripe = Stripe()

        const customer = await stripe.customers.retrieve(String(user.customerId))

        const subscription = await stripe.subscriptions.list({
            customer: customer.id
        })

        const paymentMethod = await stripe.paymentMethods.retrieve(
            subscription.data[0].default_payment_method as string
        );

        const productArr = subscription.data[0].items.data

        const product = productArr[0].plan.product

        const productRetrieve = await stripe.products.retrieve(String(product))

        return { 
            plan: subscription.data[0], 
            product: productRetrieve, 
            payment: paymentMethod 
        }
    }
}

export default new RetrieveSubscription()