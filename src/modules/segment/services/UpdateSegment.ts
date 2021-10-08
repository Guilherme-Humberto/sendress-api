import { SegmentProps } from "@shared/index"
import { prisma } from "config/prisma"

interface Request {
    data: SegmentProps
    params: { id: number }
    userId: { id: number }
}

class UpdateSegment {
    async execute({ params, data, userId }: Request) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if(!user) throw new Error("User not found")

        const segmentDefault = await prisma.segment.findFirst({
            where: { title: 'Default', userId: userId.id }
        })

        if(segmentDefault?.id === params.id) throw new Error("This segment cannot be updated.")

        await prisma.segment.updateMany({
            where: { id: params.id, userId: userId.id }, data
        })
    }
}

export default new UpdateSegment()