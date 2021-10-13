"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class ListCampaign {
    async execute({ userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        return await prisma_1.prisma.campaign.findMany({
            where: { userId: userId.id },
            orderBy: [
                { createdAt: 'desc' },
                { updatedAt: 'desc' }
            ]
        });
    }
}
exports.default = new ListCampaign();
