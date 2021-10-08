"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class DeleteSegmentMany {
    async execute({ userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id },
            select: { segments: true }
        });
        if (!user)
            throw new Error("User not found");
        const segmentDefault = await prisma_1.prisma.segment.findFirst({
            where: { title: 'Default', userId: userId.id }
        });
        if (user.segments.length <= 0)
            throw new Error("Segments is required");
        const deleteSegments = user.segments.map(async (segment) => {
            if (segment.id !== segmentDefault.id) {
                await prisma_1.prisma.lead.updateMany({
                    where: { userId: userId.id, segmentId: segment.id },
                    data: { segmentId: segmentDefault === null || segmentDefault === void 0 ? void 0 : segmentDefault.id }
                });
                await prisma_1.prisma.segment.deleteMany({
                    where: { id: segment.id, userId: userId.id }
                });
            }
        });
        return await Promise.all(deleteSegments);
    }
}
exports.default = new DeleteSegmentMany();
