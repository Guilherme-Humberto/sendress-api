import { prisma } from "config/prisma"
import { validateSchedule } from '../validations/schedule'
import { ScheduleCreateManyInput } from "shared"

interface Props { data: ScheduleCreateManyInput; userId: { id: number } }

class CreateSchedule {
    async execute({ data, userId }: Props) {
        const user = await prisma.user.findFirst({
            where: { id: userId.id },
            select: {
                id: true,
                campaigns: true,
                planMode: true,
                verified: true,
                status: true
            }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const findSchedule = await prisma.schedule.findFirst({
            where: {
                userId: userId.id,
                segmentId: Number(data.segmentId),
                campaignId: Number(data.campaignId)
            }
        })

        if (findSchedule) throw new Error('Schedule already exists')

        if (data.dates === null || data.dates === []) throw new Error('Dates is required')

        const isValidScheduleData = validateSchedule(data, userId.id)

        if (!isValidScheduleData.status) throw new Error(isValidScheduleData.message)

        return await prisma.schedule.create({ data: { ...data, userId: user.id } })
    }
}

export default new CreateSchedule()