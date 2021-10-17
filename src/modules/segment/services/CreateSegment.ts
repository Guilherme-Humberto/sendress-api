import { SegmentProps } from "@shared/index"
import { prisma } from "config/prisma"

interface Request {
    data: SegmentProps;
    userId: { id: number }
}

class CreateSegment {
    async execute({ data, userId }: Request) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const segment = await prisma.segment.findUnique({
            where: { title: data.title }
        })

        if (segment) throw new Error("List alreay exists")
        return await prisma.segment.create({ data: { ...data, userId: userId.id } })
    }
}

export default new CreateSegment()