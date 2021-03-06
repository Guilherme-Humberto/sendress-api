import { prisma } from "config/prisma"
import { CampaignOutPut } from "shared"
import { validateCampaignCreate } from '../validations/campaign'

interface Props { data: CampaignOutPut; userId: { id: number } }

const handleCreateCampaign = async ({ data, userId }: Props) => {
    const campaign = await prisma.campaign.findUnique({
        where: { name: data.name }
    })

    if (campaign) throw new Error("Campaign already exists")

    const isValidCampaign = validateCampaignCreate(data)

    if (!isValidCampaign.status) throw new Error(isValidCampaign.message)

    return await prisma.campaign.create({ data: { ...data, userId: userId.id, segmentId: Number(data.segmentId) } })
}

class CreateCampaign {
    async execute({ data, userId }: Props) {
        const user = await prisma.user.findFirst({
            where: { id: userId.id },
            select: {
                campaigns: true,
                planMode: true,
                verified: true,
                status: true
            }
        })

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        if (user?.planMode === 'BASIC') {
            if (user.campaigns.length <= 1 && user.campaigns.length <= 20) {
                return await handleCreateCampaign({ data, userId })
            } else {
                throw new Error("Your subscription can create up to 20 campaigns")
            }
        }

        if (user?.planMode === 'PREMIUM') {
            if (user.campaigns.length <= 1 && user.campaigns.length <= 50) {
                return await handleCreateCampaign({ data, userId })
            } else {
                throw new Error("Your subscription can create up to 50 campaigns")
            }
        }
    }
}

export default new CreateCampaign()