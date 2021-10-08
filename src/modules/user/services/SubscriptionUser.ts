import bcrypt from 'bcryptjs'
import { stripe as Stripe } from '@core/stripe/configure';
import { prisma } from "config/prisma"
import { UserProps } from "shared";
import { sendEmailConfirmation } from "../utils/emailConfirmation";
import { validateUser } from '../validations/user';

interface Request { userData: UserProps; productId: string }

class SubscriptionUser {
    async execute({ userData, productId }: Request) {

        const stripe = Stripe()

        const user = await prisma.user.findUnique({
            where: { email: userData.email }
        })

        const { data: userStripe } = await stripe.customers.list({
            email: userData.email
        })

        if (user || userStripe.length >= 1) throw new Error("User alreary exists")

        const isValidUser = validateUser(userData)

        if (!isValidUser.status)
            throw new Error(isValidUser.message)

        const generateToken = bcrypt.hashSync(userData.email, 10)

        await sendEmailConfirmation({
            to: userData.email,
            from: String(process.env.EMAIL_FROM_ADMIN),
            subject: 'Confirmação de cadastro',
            username: userData.name,
            useremail: userData.email,
            token: generateToken,
            productId
        })

        const hashPass = bcrypt.hashSync(userData.password, 10)

        return await prisma.user.create({ 
            data: { ...userData, password: hashPass, customerId: 'pending', accessToken: 'pending' } 
        })
    }
}

export default new SubscriptionUser()