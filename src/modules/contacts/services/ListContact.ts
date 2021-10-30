import { prisma } from "config/prisma"

interface Props {
    userId: { id: number }
}

class ListContacts {
    async execute({ userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        return await prisma.contact.findMany({
            where: { userId: userId.id },
            select: {
                id: true,
                phone: true,
                name: true,
                business: true,
                email: true,
                segment: true,
                segmentId: true,
                status: true
            },
            orderBy: [
                { createdAt: 'desc' },
                { updatedAt: 'desc' }
            ]
        })
    }
}

export default new ListContacts()