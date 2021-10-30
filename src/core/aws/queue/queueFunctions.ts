import { queueService } from "@core/aws/aws-sqs"
import {
    PurgeQueueProps,
    ReceiveMessageProps
} from '@shared/index'

interface AttrsProps {
    MsgId: { StringValue: string }
    To: { StringValue: string }
    From: { StringValue: string }
    Subject: { StringValue: string }
}

interface SendMessageBatchProps {
    data: {
        Id: string
        MessageBody: string
        DelaySeconds: number
        MessageGroupId: string
        MessageDeduplicationId: string
    }
}

interface DeleteMessageBatchProps {
    data: { Id: string; ReceiptHandle: string }
}

const QueueUrl = String(process.env.QUEUE_URL)

export const Queue = {
    async sendToQueue({ data }: SendMessageBatchProps) {
        return await queueService.sendMessageBatch({
            Entries: [
                {
                    Id: data.Id,
                    MessageBody: data.MessageBody,
                    DelaySeconds: data.DelaySeconds,
                    MessageGroupId: data.MessageGroupId,
                    MessageDeduplicationId: data.MessageDeduplicationId
                }
            ],
            QueueUrl,
        }).promise()
    },

    async purgeQueue({ params }: PurgeQueueProps) {
        await queueService.purgeQueue(params, function (err, data) {
            if (err) return new Error("Erro " + err)
            console.log("Success", data);
        }).promise()
    },

    async receiveMessage({ params }: ReceiveMessageProps) {
        return await queueService.receiveMessage(params).promise()
    },

    async deleteMessage({ data }: DeleteMessageBatchProps) {
        return await queueService.deleteMessageBatch({
            Entries: [
                {
                    Id: data.Id,
                    ReceiptHandle: data.ReceiptHandle
                },
            ],
            QueueUrl
        }, function (err, data) {
            if (err) return new Error("Erro " + err)
            return { status: true, data }
        }).promise()
    }
}