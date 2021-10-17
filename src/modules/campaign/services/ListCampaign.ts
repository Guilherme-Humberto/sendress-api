import { prisma } from "config/prisma"

interface Props {
    userId: { id: number }
}

class ListCampaign {
    async execute({ userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        return await prisma.campaign.findMany({
            where: { userId: userId.id },
            orderBy: [
                { createdAt: 'desc' },
                { updatedAt: 'desc' }
            ]
        })
    }
}

export default new ListCampaign()