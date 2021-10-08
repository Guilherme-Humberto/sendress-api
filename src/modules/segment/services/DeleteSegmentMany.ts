import { prisma } from "config/prisma"

interface Request {
    userId: { id: number }
}
class DeleteSegmentMany {
    async execute({ userId }: Request) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id },
            select: { segments: true }
        })

        if (!user) throw new Error("User not found")

        const segmentDefault = await prisma.segment.findFirst({
            where: { title: 'Default', userId: userId.id }
        })

        if (user.segments.length <= 0) throw new Error("Segments is required");

        const deleteSegments = user.segments.map(async segment => {
            if (segment.id !== segmentDefault!.id) {

                await prisma.lead.updateMany({
                    where: { userId: userId.id, segmentId: segment.id },
                    data: { segmentId: segmentDefault?.id }
                })

                await prisma.segment.deleteMany({
                    where: { id: segment.id, userId: userId.id }
                })
            }
        })

        return await Promise.all(deleteSegments)
    }
}

export default new DeleteSegmentMany()