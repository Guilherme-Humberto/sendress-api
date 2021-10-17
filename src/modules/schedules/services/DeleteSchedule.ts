import { prisma } from "config/prisma"

interface Props { scheduleId: { id: number }; userId: { id: number } }

class DeleteSchedule {
    async execute({ scheduleId, userId }: Props) {
        const user = await prisma.user.findFirst({
            where: { id: userId.id },
            select: {
                campaigns: true,
                verified: true,
                status: true
            }
        })

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        return await prisma.schedule.deleteMany({
            where: { id: scheduleId.id, userId: userId.id }
        })
    }
}

export default new DeleteSchedule()