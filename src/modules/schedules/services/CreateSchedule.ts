import { prisma } from "config/prisma"
import { ScheduleCreateManyInput } from "shared"

interface Props { data: ScheduleCreateManyInput; userId: { id: number } }

class CreateSchedule {
    async execute({ data, userId }: Props) {
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

        const findSchedule = await prisma.schedule.findFirst({
            where: { segmentId: data.segmentId, campaignId: data.campaignId }
        })

        if (findSchedule) throw new Error('Schedule already exists')

        return await prisma.schedule.create({ data: { ...data, userId: userId.id } })
    }
}

export default new CreateSchedule()