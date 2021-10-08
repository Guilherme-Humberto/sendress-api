import { prisma } from "config/prisma"

interface Request { userId: { id: number } }

class ListSegment {
    async execute({ userId }: Request) {
        return await prisma.segment.findMany({
            where: {
                userId: 1
            },
            select: {
                id: true,
                title: true,
                status: true,
                leads: true,
                createdAt: true
            },
            orderBy: [
                { createdAt: 'desc' },
                { updatedAt: 'desc' }
            ]
        })
    }
}

export default new ListSegment()