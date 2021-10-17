import { prisma } from "config/prisma"
import { LeadCreateInput } from "shared"

interface Props { data: LeadCreateInput; params: { id: number }; userId: { id: number } }

class UpdateLead {
    async execute({ data, params, userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const lead = await prisma.lead.findUnique({
            where: { id: params.id }
        })

        if (!lead) throw new Error("Lead not found")

        const leadUpdate = await prisma.lead.updateMany({
            where: { id: params.id, userId: userId.id }, data
        })

        return leadUpdate
    }
}

export default new UpdateLead()