"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
const sender_1 = require("../validations/sender");
class CreateSender {
    async execute({ data, userId }) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: userId.id, senders: { every: { email: { contains: data.email } } } },
            select: { senders: true, verified: true, status: true }
        });
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const userSenders = user === null || user === void 0 ? void 0 : user.senders;
        if (userSenders.length >= 1) {
            throw new Error("Sender alreay exists");
        }
        const isValidSender = (0, sender_1.validateSender)(data);
        if (!isValidSender.status) {
            return {
                status: false,
                message: isValidSender.message
            };
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
        const createSender = await prisma_1.prisma.sender.create({
            data: Object.assign(Object.assign({}, data), { userId: userId.id })
        });
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
        return createSender;
    }
}
exports.default = new CreateSender();
