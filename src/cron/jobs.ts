import { stripe as Stripe } from '@core/stripe/configure'
import { prisma } from "config/prisma"
import cron from 'node-cron'

const stripe = Stripe()

const getActiveSubscriptions = async (customerId: string) => {
    const subscriptions = await stripe.subscriptions.list({ 
        customer: customerId, status: 'active' 
    });
    return subscriptions.data
}

const getUsersRegisters = async () => await prisma.user.findMany()

export const checkSubscriptionSituation = async () => {
    const users = await getUsersRegisters()

    const consultSubscription = await Promise.all(
        users.map(async user => await getActiveSubscriptions(user.customerId))
    )

    return consultSubscription
}