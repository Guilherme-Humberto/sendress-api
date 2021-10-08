import { mailService } from '@core/aws/aws'
import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

interface MessageProps {
    to: string
    from: string
    subject: string
    username: string
    useremail: string
    token: string
    productId: string
}

const sendEmailConfirmation = async ({ ...data }: MessageProps) => {
    fs.readFile(path.resolve(__dirname, './email-confirmation.html'), async (err, emailHtmlTemplate) => {
        if (err) {
            console.log("Unable to load HTML Template");
            throw err;
        }

        var emailData = {
            "username": data.username,
            "useremail": data.useremail,
            "productId": data.productId,
            "token": String(data.token)
        };

        var templateHtml = Handlebars.compile(emailHtmlTemplate.toString());
        var bodyHtml = templateHtml(emailData);

        await mailService.sendEmail({
            Source: `${data.from}`,
            Destination: {
                ToAddresses: [`${data.to}`]
            },
            Message: {
                Subject: {
                    Data: `${data.subject}`
                },
                Body: {
                    Html: {
                        Data: bodyHtml
                    }
                }
            },
        }).promise()

    })
    return { status: true}
}

export { sendEmailConfirmation }