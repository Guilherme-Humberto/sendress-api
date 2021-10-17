import { prisma } from "config/prisma"
import { LeadCreateManyInput } from "shared"
import { validateLead } from "../validations/lead"

interface Props { data: LeadCreateManyInput, userId: { id: number } }

class CreateLead {
    async execute({ data, userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const lead = await prisma.lead.findUnique({
            where: { email: data.email }
        })

        if (lead) throw new Error("Lead already exists")

        const isValidLead = validateLead(data)

        if (!isValidLead.status) throw new Error(isValidLead.message)

        const segmentDefault = await prisma.segment.findUnique({
            where: { title: 'Default' }
        })

        const segmentId = data.segmentId ? data.segmentId : segmentDefault?.id
        return await prisma.lead.create({ data: { ...data, segmentId, userId: userId.id } })
    }
}

export default new CreateLead()