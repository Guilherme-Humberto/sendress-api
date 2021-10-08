import bcrypt from 'bcryptjs'
import * as EmailValidator from 'email-validator';
import { prisma } from "config/prisma"
import { stripe } from '@core/stripe/configure'
import { createCheckoutSession } from '@core/stripe/checkout'

interface Request { data: { email: string }; confirmation_token: string; productId: string }

class CreateSubscription {
    async execute({ data, confirmation_token, productId }: Request) {
        const isValidEmail = EmailValidator.validate(data.email)

        if (!isValidEmail)
            throw new Error("Email invalid")

        const user = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (user?.verified) throw new Error("User already verified")

        if (!user) throw new Error("User not found")

        const isValidHash = bcrypt.compareSync(data.email, confirmation_token)

        if (!isValidHash) throw new Error("Invalid hash")

        const stripeSession = stripe()

        const getPrices = await stripeSession.prices.list({ product: productId })

        return await createCheckoutSession({ 
            prices: getPrices, 
            customer: data.email 
        })
    }
}

export default new CreateSubscription()