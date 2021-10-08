import { prisma } from "config/prisma"

interface Props { params: { id: number }, userId: { id: number } }

class DeleteLead {
    async execute({ params, userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if(!user) throw new Error("User not found")

        const lead = await prisma.lead.findFirst({
            where: { id: params.id, userId: userId.id }
        })

        if (!lead) throw new Error("Lead not found")

        await prisma.lead.deleteMany({
            where: { id: params.id, userId: userId.id }
        })

        return { status: true }
    }
}

export default new DeleteLead()