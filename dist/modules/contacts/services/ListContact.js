"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class ListContacts {
    async execute({ userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        return await prisma_1.prisma.contact.findMany({
            where: { userId: userId.id },
            select: {
                id: true,
                phone: true,
                name: true,
                business: true,
                email: true,
                segment: true,
                segmentId: true,
                status: true
            },
            orderBy: [
                { createdAt: 'desc' },
                { updatedAt: 'desc' }
            ]
        });
    }
}
exports.default = new ListContacts();
