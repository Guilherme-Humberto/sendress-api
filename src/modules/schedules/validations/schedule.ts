import { ScheduleCreateManyInput } from "shared"

const validateSchedule = (data: ScheduleCreateManyInput, userId: number) => {
    const isEmpty = !userId || !data.segmentId

    if (isEmpty) {
        return {
            status: false,
            message: 'user, segment and dates is required'
        }
    }

    return { status: true }
}

export { validateSchedule }