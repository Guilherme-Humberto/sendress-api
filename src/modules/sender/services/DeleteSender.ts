import * as EmailValidator from 'email-validator';
import { prisma } from "config/prisma"
import { mailService } from '@core/aws/aws-ses'

interface Request { emails: string[], userId: { email: string } }

class CreateSender {
    async execute({ emails, userId }: Request) {
        const user = await prisma.user.findUnique({
            where: { email: userId.email },
            select: { senders: true, id: true }
        })

        if (!user) throw new Error('User not found')

        const deleteEmails = emails.map(async email => {
            const sender = await prisma.sender.findUnique({
                where: { email }
            })

            if (!sender) {
                return {
                    status: false,
                    message: `${email} not found`
                }
            }

            const isValidEmail = EmailValidator.validate(email)

            if (!isValidEmail) {
                return {
                    status: false,
                    message: `${email} invalid`
                }
            }

            await prisma.sender.delete({
                where: { email }
            })

            await mailService.deleteVerifiedEmailAddress({
                EmailAddress: email
            }).promise()

            return { status: true }
        })

        return await Promise.all(deleteEmails)
    }
}

export default new CreateSender()