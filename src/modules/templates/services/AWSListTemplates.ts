import { prisma } from "@config/prisma"
import { mailService } from "@core/aws/aws-ses"

interface Props {
    userId: { id: number }
}

class AWSListTemplates {
    async execute({ userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const { TemplatesMetadata: getListTemplates } = await mailService.listTemplates().promise()

        const findTemplates = getListTemplates?.map(async template => {
            return await mailService.getTemplate({ TemplateName: String(template?.Name) }).promise()
        }) as []

        return await Promise.all(findTemplates)
    }
}

export default new AWSListTemplates()