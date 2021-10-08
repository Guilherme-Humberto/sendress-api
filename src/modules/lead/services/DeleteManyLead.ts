import { prisma } from "config/prisma"

interface Props { userId: { id: number } }

class DeleteManyLead {
    async execute({ userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id },
            select: { leads: true }
        })

        if (!user) throw new Error("User not found");

        if (user.leads.length <= 0) throw new Error("Leads is required");

        const deleteLeads = user.leads.map(async (lead) => {
            return await prisma.lead.deleteMany({
                where: { id: lead.id, userId: userId.id }
            })
        })

        return await Promise.all(deleteLeads)
    }
}

export default new DeleteManyLead()