"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const aws_sqs_1 = require("@core/aws/aws-sqs");
const QueueUrl = String(process.env.QUEUE_URL);
exports.Queue = {
    async sendToQueue({ data }) {
        return await aws_sqs_1.queueService.sendMessageBatch({
            Entries: [
                {
                    Id: data.Id,
                    MessageAttributes: {
                        "MsgId": {
                            DataType: 'String',
                            StringValue: data.MessageAttributes.MsgId.StringValue
                        },
                        "To": {
                            DataType: 'String',
                            StringValue: data.MessageAttributes.To.StringValue
                        },
                        "From": {
                            DataType: 'String',
                            StringValue: data.MessageAttributes.To.StringValue
                        },
                        "Subject": {
                            DataType: 'String',
                            StringValue: data.MessageAttributes.Subject.StringValue
                        }
                    },
                    MessageBody: data.MessageBody,
                    DelaySeconds: data.DelaySeconds,
                    MessageGroupId: data.MessageGroupId,
                    MessageDeduplicationId: data.MessageDeduplicationId
                }
            ],
            QueueUrl,
        }).promise();
    },
    async purgeQueue({ params }) {
        await aws_sqs_1.queueService.purgeQueue(params, function (err, data) {
            if (err)
                return new Error("Erro " + err);
            console.log("Success", data);
        }).promise();
    },
    async receiveMessage({ params }) {
        return await aws_sqs_1.queueService.receiveMessage(params).promise();
    },
    async deleteMessage({ data }) {
        return await aws_sqs_1.queueService.deleteMessageBatch({
            Entries: [
                {
                    Id: data.Id,
                    ReceiptHandle: data.ReceiptHandle
                },
            ],
            QueueUrl
        }, function (err, data) {
            if (err)
                return new Error("Erro " + err);
            return { status: true, data };
        }).promise();
    }
};
