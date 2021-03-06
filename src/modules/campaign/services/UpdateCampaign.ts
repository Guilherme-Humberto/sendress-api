import { prisma } from "config/prisma"
import { CampaignOutPut } from "shared"
import { validateCampaignEdit } from '../validations/campaign'

interface Props { data: CampaignOutPut, params: { id: number }; userId: { id: number } }

class UpdateCampaign {
    async execute({ data, params, userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const campaign = await prisma.campaign.findUnique({
            where: { id: params.id }
        })

        if (!campaign) throw new Error("Campaign not found")

        await prisma.campaign.updateMany({
            where: { id: params.id, userId: userId.id, },
            data: { ...data }
        })

        return data
    }
}

export default new UpdateCampaign()