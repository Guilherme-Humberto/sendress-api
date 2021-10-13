import { prisma } from "config/prisma"
import { mailService } from '@core/aws/aws-ses'
import { validateSender } from "../validations/sender"
import { SenderOutPut } from "shared";

interface Request { data: SenderOutPut, userId: { id: number } }

class CreateSender {
    async execute({ data, userId }: Request) {
        const user = await prisma.user.findMany({
            where: { id: userId.id, senders: { every: { email: { contains: data.email } } } },
            select: { senders: true }
        })

        if (user[0]?.senders.length >= 1) {
            throw new Error("Sender alreay exists")
        }

        const isValidSender = validateSender(data)

        if (!isValidSender.status) {
            return {
                status: false,
                message: isValidSender.message
            }
        }

        // await mailService.verifyEmailIdentity({
        //     EmailAddress: data.email,
        // }, (error, _data) => {
        //     if (error) return {
        //         message: 'Error to send email verification, please try again',
        //         status: false
        //     }

        //     return {
        //         message: 'You received a email for verification',
        //         status: true
        //     }

        // }).promise()

        const createSender = await prisma.sender.create({
            data: { ...data, userId: userId.id }
        })

        // if (!user) throw new Error('User not found')

        // const createSenders = user.senders.map(async sender => {
        //     const senderResponse = await prisma.sender.findFirst({
        //         where: { email: sender.email, userId: userId.id }
        //     })

        //     if (senderResponse) {
        //         return {
        //             status: false,
        //             message: `${sender.email} already exists`
        //         }
        //     }
        //     const isValidSender = validateSender(data)

        //     if (!isValidSender.status) {
        //         return {
        //             status: false,
        //             message: isValidSender.message
        //         }
        //     }

        //     await mailService.verifyEmailAddress({
        //         EmailAddress: data.email
        //     }, (error, _data) => {
        //         if (error) return {
        //             message: 'Error to send email verification, please try again',
        //             status: false
        //         }

        //         return {
        //             message: 'You received a email for verification',
        //             status: true
        //         }

        //     }).promise()

        //     const createSender = await prisma.sender.create({
        //         data: { ...data, userId: user.id }
        //     })

        //     return createSender
        // })

        return createSender
    }
}

export default new CreateSender()