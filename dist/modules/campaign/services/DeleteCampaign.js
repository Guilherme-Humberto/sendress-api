"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class DeleteCampaign {
    async execute({ params, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!user.verified && user.status === 'DISABLED')
            throw new Error("User without permission");
        const campaign = await prisma_1.prisma.campaign.findUnique({
            where: { id: params.id }
        });
        if (!campaign) {
            throw new Error("Campaign not found");
        }
        await prisma_1.prisma.campaign.deleteMany({
            where: { id: params.id, userId: userId.id }
        });
        return { status: true };
    }
}
exports.default = new DeleteCampaign();
