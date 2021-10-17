import { prisma } from "config/prisma"

interface Request { userId: { id: number } }

class SenderSegment {
    async execute({ userId }: Request) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error('User not found')

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        return await prisma.sender.findMany({
            where: { userId: userId.id }
        })
    }
}

export default new SenderSegment()