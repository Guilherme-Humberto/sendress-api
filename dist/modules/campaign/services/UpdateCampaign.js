"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class UpdateCampaign {
    async execute({ data, params, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        const campaign = await prisma_1.prisma.campaign.findUnique({
            where: { id: params.id }
        });
        if (!campaign)
            throw new Error("Campaign not found");
        await prisma_1.prisma.campaign.updateMany({
            where: { id: params.id, userId: userId.id, },
            data: Object.assign({}, data)
        });
        return data;
    }
}
exports.default = new UpdateCampaign();
