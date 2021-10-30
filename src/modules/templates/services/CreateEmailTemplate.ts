import { prisma } from "config/prisma"
import { TemplateCreateManyInput } from "@shared/index"
import { validateEmailTemplate } from "../validations/templates"

interface Props {
    data: TemplateCreateManyInput
    userId: { id: number }
}

class CreateEmailTemplate {
    async execute({ data, userId }: Props) {
        const user = await prisma.user.findFirst({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const template = await prisma.template.findFirst({
            where: { userId: userId.id, templateName: data.templateName }
        })

        if(template) throw new Error("Template already exists")

        const isValidTemplate = validateEmailTemplate(data)

        if(!isValidTemplate.status) throw new Error(isValidTemplate.message)

        const newTemplate = await prisma.template.create({
            data: { userId: user.id, ...data }
        })

        return newTemplate
    }
}

export default new CreateEmailTemplate()