import { mailService } from './aws'

interface MessageProps {
    to: string
    from: string
    subject: string
    content: string
}

export default {
    async handle({ ...data }: Omit<MessageProps, 'lists'>) {
        return await mailService.sendEmail({
            Source: `${data.from}`,
            Destination: {
                ToAddresses: [`${data.to}`]
            },
            Message: {
                Subject: {
                    Data: `${data.subject}`
                },
                Body: {
                    Text: {
                        Data: `${data.content}`
                    }
                }
            },
        }).promise()
    },
};