"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ses_1 = require("../aws-ses");
exports.default = {
    async handle({ to, from, subject, content }) {
        return await aws_ses_1.mailService.sendEmail({
            Source: `${from}`,
            Destination: {
                ToAddresses: [`${to}`]
            },
            Message: {
                Subject: {
                    Data: `${subject}`
                },
                Body: {
                    Text: {
                        Data: `${content}`
                    }
                }
            },
        }).promise();
    },
};
