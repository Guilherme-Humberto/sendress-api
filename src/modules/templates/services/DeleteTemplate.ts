import { prisma } from "@config/prisma"

interface Props {
    userId: { id: number }
    templateId: { id: number }
}

class DeleteTemplates {
    async execute({ userId, templateId }: Props) {
        const user = await prisma.user.findFirst({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        return await prisma.template.deleteMany({
            where: { userId: user.id, id: templateId.id }
        })
    }
}

export default new DeleteTemplates()