"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class DeleteManyLead {
    async execute({ userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id },
            select: { verified: true, status: true, campaigns: true }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        if (user.campaigns.length <= 0)
            throw new Error("Campaigns is required");
        const deleteCampaigns = user.campaigns.map(async (campaign) => {
            return await prisma_1.prisma.campaign.deleteMany({
                where: { id: campaign.id, userId: userId.id }
            });
        });
        return await Promise.all(deleteCampaigns);
    }
}
exports.default = new DeleteManyLead();
