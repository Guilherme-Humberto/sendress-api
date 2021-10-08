import { prisma } from "config/prisma"
import { EmailTemplateCreateInput } from "@shared/index"
import { mailService } from "@core/aws/aws"


class CreateEmailTemplate {
    async execute() {

        return await mailService.createTemplate({
            Template: {
                TemplateName: "MyTemplate",
                SubjectPart: "Greetings, {{name}}!",
                HtmlPart: "<h1>Hello {{name}},</h1><p>Your favorite animal is {{favoriteanimal}}.</p>",
                TextPart: "Dear {{name}},\r\nYour favorite animal is {{favoriteanimal}}."
            }
        }).promise()
    }
}

export default new CreateEmailTemplate()