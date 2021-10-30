import { prisma } from "config/prisma"
import { ScheduleCreateManyInput } from "shared"

interface Props {
    userId: { id: number };
    scheduleId: { id: number };
    data: ScheduleCreateManyInput;
}

class UpdateSchedule {
    async execute({ data, userId, scheduleId }: Props) {
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

        return await prisma.schedule.updateMany({
            where: { id: scheduleId.id, userId: userId.id }, data
        })
    }
}

export default new UpdateSchedule()