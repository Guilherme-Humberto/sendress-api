import { prisma } from "config/prisma"

interface Request { userId: { id: number } }

class ListSegment {
    async execute({ userId }: Request) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        return await prisma.segment.findMany({
            where: {
                userId: userId.id
            },
            select: {
                id: true,
                title: true,
                status: true,
                contacts: true,
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