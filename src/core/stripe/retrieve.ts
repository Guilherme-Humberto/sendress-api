import { stripe } from './configure'

const retrieveSession = async (transactionId: string) => {
    const stripeSession = stripe()
    return await stripeSession.checkout.sessions.retrieve(transactionId)
}

export { retrieveSession }