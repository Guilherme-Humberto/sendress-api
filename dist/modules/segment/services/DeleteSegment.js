"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class DeleteSegment {
    async execute({ params, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const segmentDefault = await prisma_1.prisma.segment.findFirst({
            where: { title: 'Default', userId: userId.id }
        });
        if ((segmentDefault === null || segmentDefault === void 0 ? void 0 : segmentDefault.id) === params.id)
            throw new Error("This segment cannot be deleted.");
        const contacts = await prisma_1.prisma.contact.findMany({
            where: { userId: userId.id, segmentId: params.id }
        });
        contacts.forEach(async (contact) => {
            return await prisma_1.prisma.contact.update({
                where: { id: contact.id },
                data: { segmentId: Number(segmentDefault === null || segmentDefault === void 0 ? void 0 : segmentDefault.id) }
            });
        });
        return await prisma_1.prisma.segment.deleteMany({
            where: { id: params.id, userId: userId.id }
        });
    }
}
exports.default = new DeleteSegment();
