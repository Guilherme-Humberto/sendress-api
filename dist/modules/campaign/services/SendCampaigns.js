"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4_1 = require("uuidv4");
const prisma_1 = require("config/prisma");
const queueFunctions_1 = require("@core/aws/queue/queueFunctions");
class SendCampaigns {
    async execute({ userId, campaignId, senderId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const campaign = await prisma_1.prisma.campaign.findFirst({
            where: { id: campaignId.id, userId: user.id, senderId: Number(senderId.id) }
        });
        if (!campaign)
            throw new Error("Campaign not found");
        const sender = await prisma_1.prisma.sender.findFirst({
            where: { id: Number(campaign === null || campaign === void 0 ? void 0 : campaign.senderId), userId: user.id }
        });
        if (!sender)
            throw new Error("Sender not found");
        const segment = await prisma_1.prisma.segment.findFirst({
            where: {
                id: Number(campaign === null || campaign === void 0 ? void 0 : campaign.segmentId), userId: user.id
            },
            select: { leads: { where: { status: 'ACTIVE' } } }
        });
        if (!segment)
            throw new Error("Segment not found");
        const segmentsLeads = segment === null || segment === void 0 ? void 0 : segment.leads;
        return await Promise.all(segmentsLeads.map(async (lead) => {
            const messageBodyObj = {
                MsgId: { StringValue: String(`msgid${lead.id}`) },
                To: { StringValue: String(lead.email) },
                From: { StringValue: String(sender.email) },
                Subject: { StringValue: String(campaign.subject) },
                content: String(campaign.content)
            };
            const params = {
                Id: (0, uuidv4_1.uuid)(),
                MessageBody: JSON.stringify(messageBodyObj),
                DelaySeconds: 0,
                MessageGroupId: `GroupId_${(0, uuidv4_1.uuid)()}-${lead.id}`,
                MessageDeduplicationId: `DuplicatId_${(0, uuidv4_1.uuid)()}-${lead.id}`
            };
            return await queueFunctions_1.Queue.sendToQueue({ data: Object.assign({}, params) });
        }));
        // const receiveResponse = await Queue.receiveMessage({
        //     params: {
        //         QueueUrl,
        //         MessageAttributeNames: ['All'],
        //         MaxNumberOfMessages: 5
        //     }
        // })
        // if (!receiveResponse.$response.error) {
        //     const listReceivesMessages = receiveResponse.Messages as SQS.MessageList || []
        //     return await Promise.all(
        //         listReceivesMessages.map(async message => {
        //             const messageAttrs = message.MessageAttributes as unknown as RecieveProps
        //             await sendMail.handle({
        //                 to: messageAttrs.To.StringValue,
        //                 from: messageAttrs.From.StringValue,
        //                 subject: messageAttrs.Subject.StringValue,
        //                 content: message.Body as string
        //             })
        //             return await Queue.deleteMessage({
        //                 data: {
        //                     Id: String(message.MessageId),
        //                     ReceiptHandle: String(message.ReceiptHandle)
        //                 }
        //             })
        //         })
        //     )
        // }
    }
}
exports.default = new SendCampaigns();
