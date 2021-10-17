import { prisma } from "config/prisma"

interface Props { userId: { id: number } }

class ListSchedule {
    async execute({ userId }: Props) {
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

        return await prisma.schedule.findMany({
            where: { userId: userId.id }
        })
    }
}

export default new ListSchedule()