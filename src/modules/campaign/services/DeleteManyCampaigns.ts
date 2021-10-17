import { prisma } from "config/prisma"

interface Props { userId: { id: number } }

class DeleteManyLead {
    async execute({ userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id },
            select: { verified: true, status: true, campaigns: true }
        })

        if (!user) throw new Error("User not found");

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        if (user.campaigns.length <= 0) throw new Error("Campaigns is required");

        const deleteCampaigns = user.campaigns.map(async (campaign) => {
            return await prisma.campaign.deleteMany({
                where: { id: campaign.id, userId: userId.id }
            })
        })

        return await Promise.all(deleteCampaigns)
    }
}

export default new DeleteManyLead()