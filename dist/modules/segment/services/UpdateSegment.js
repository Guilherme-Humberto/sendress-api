"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class UpdateSegment {
    async execute({ params, data, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        const segmentDefault = await prisma_1.prisma.segment.findFirst({
            where: { title: 'Default', userId: userId.id }
        });
        if ((segmentDefault === null || segmentDefault === void 0 ? void 0 : segmentDefault.id) === params.id)
            throw new Error("This segment cannot be updated.");
        await prisma_1.prisma.segment.updateMany({
            where: { id: params.id, userId: userId.id }, data
        });
    }
}
exports.default = new UpdateSegment();
