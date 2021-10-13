import { mailService } from '../aws-ses'

interface MessageProps {
    to: string
    from: string
    subject: string
    content: string
}

export default {
    async handle({ to, from, subject, content }: MessageProps) {
        return await mailService.sendEmail({
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
        }).promise()
    },
};