"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queueParams = {
    // Remove DelaySeconds parameter and value for FIFO queues
    DelaySeconds: 10,
    MessageAttributes: {
        "Title": {
            DataType: "String",
            StringValue: "The Whistler"
        },
        "Author": {
            DataType: "String",
            StringValue: "John Grisham"
        },
        "WeeksOn": {
            DataType: "Number",
            StringValue: "6"
        }
    },
    MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
    QueueUrl: "SQS_QUEUE_URL"
};
exports.default = {
    access_key: process.env.AWS_ACCESS_KEY_ID,
    secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    queueParams
};
