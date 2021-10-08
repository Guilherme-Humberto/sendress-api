import { prisma } from "config/prisma"

interface Request {
    params: { id: number };
    userId: { id: number }
}

class DeleteSegment {
    async execute({ params, userId }: Request) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        const segmentDefault = await prisma.segment.findFirst({
            where: { title: 'Default', userId: userId.id }
        })

        if (segmentDefault?.id === params.id) throw new Error("This segment cannot be deleted.")

        const leads = await prisma.lead.findMany({
            where: { userId: userId.id, segmentId: params.id }
        })

        leads.forEach(async lead => {
            return await prisma.lead.update({
                where: { id: lead.id },
                data: { segmentId: Number(segmentDefault?.id) }
            })
        })

        return await prisma.segment.deleteMany({
            where: { id: params.id, userId: userId.id }
        })
    }
}

export default new DeleteSegment()