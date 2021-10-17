import { uuid } from 'uuidv4';
import { prisma } from "config/prisma"
import { Lead } from ".prisma/client"
import { Queue } from "@core/aws/queue/queueFunctions"

interface Props {
    userId: { id: number }
    campaignId: { id: number }
    senderId: { id: number }
}

class SendCampaigns {
    async execute({ userId, campaignId, senderId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const campaign = await prisma.campaign.findFirst({
            where: { id: campaignId.id, userId: user.id, senderId: Number(senderId.id) }
        })

        if (!campaign) throw new Error("Campaign not found")

        const sender = await prisma.sender.findFirst({
            where: { id: Number(campaign?.senderId), userId: user.id }
        })

        if (!sender) throw new Error("Sender not found")

        const segment = await prisma.segment.findFirst({
            where: {
                id: Number(campaign?.segmentId), userId: user.id
            },
            select: { leads: { where: { status: 'ACTIVE' } } }
        })

        if (!segment) throw new Error("Segment not found")

        const segmentsLeads = segment?.leads as Lead[]

        return await Promise.all(
            segmentsLeads.map(async lead => {
                const messageBodyObj = {
                    MsgId: { StringValue: String(`msgid${lead.id}`) },
                    To: { StringValue: String(lead.email) },
                    From: { StringValue: String(sender.email) },
                    Subject: { StringValue: String(campaign.subject) },
                    content: String(campaign.content)
                }

                const params = {
                    Id: uuid(),
                    MessageBody: JSON.stringify(messageBodyObj),
                    DelaySeconds: 0,
                    MessageGroupId: `GroupId_${uuid()}-${lead.id}`,
                    MessageDeduplicationId: `DuplicatId_${uuid()}-${lead.id}`
                };

                return await Queue.sendToQueue({ data: { ...params } })
            })
        )

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

export default new SendCampaigns()