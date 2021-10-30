import { prisma } from "@config/prisma"
import { TemplateCreateManyInput } from "@shared/index"

interface Props {
    data: TemplateCreateManyInput
    userId: { id: number }
    templateId: { id: number }
}

class UpdateTemplates {
    async execute({ userId, data, templateId }: Props) {
        const user = await prisma.user.findFirst({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        return await prisma.template.updateMany({
            where: { id: templateId.id },
            data
        })
    }
}

export default new UpdateTemplates()