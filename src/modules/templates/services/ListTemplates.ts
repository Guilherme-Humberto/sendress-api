import { prisma } from "@config/prisma"

interface Props {
    userId: { id: number }
}

class ListTemplates {
    async execute({ userId }: Props) {
        const user = await prisma.user.findFirst({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        return await prisma.template.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        })
    }
}

export default new ListTemplates()