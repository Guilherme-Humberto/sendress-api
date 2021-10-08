import { prisma } from "config/prisma"

interface Props {
    userId: { id: number }
}

class ListCampaign {
    async execute({ userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if(!user) throw new Error("User not found")

        return await prisma.campaign.findMany({
            where: { userId: userId.id }
        })
    }
}

export default new ListCampaign()