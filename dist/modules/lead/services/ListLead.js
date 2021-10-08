"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class ListLead {
    async execute({ userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        return await prisma_1.prisma.lead.findMany({
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
exports.default = new ListLead();
