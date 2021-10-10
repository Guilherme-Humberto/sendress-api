"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class ListSegment {
    async execute({ userId }) {
        return await prisma_1.prisma.segment.findMany({
            where: {
                userId: userId.id
            },
            select: {
                id: true,
                title: true,
                status: true,
                leads: true,
                createdAt: true
            },
            orderBy: [
                { createdAt: 'desc' },
                { updatedAt: 'desc' }
            ]
        });
    }
}
exports.default = new ListSegment();
