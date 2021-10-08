import { prisma } from "config/prisma"

interface Props { params: { id: number }; userId: { id: number } }

class DeleteCampaign {
    async execute({ params, userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if(!user) throw new Error("User not found")

        const campaign = await prisma.campaign.findUnique({
            where: { id: params.id }
        })

        if (!campaign) {
            throw new Error("Campaign not found")
        }

        await prisma.campaign.deleteMany({
            where: { id: params.id, userId: userId.id }
        })

        return { status: true }
    }
}

export default new DeleteCampaign()