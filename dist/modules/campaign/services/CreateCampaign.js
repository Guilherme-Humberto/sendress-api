"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
const campaign_1 = require("../validations/campaign");
const handleCreateCampaign = async ({ data, userId }) => {
    const campaign = await prisma_1.prisma.campaign.findUnique({
        where: { name: data.name }
    });
    if (campaign)
        throw new Error("Campaign already exists");
    const isValidCampaign = (0, campaign_1.validateCampaignCreate)(data);
    if (!isValidCampaign.status)
        throw new Error(isValidCampaign.message);
    return await prisma_1.prisma.campaign.create({ data: Object.assign(Object.assign({}, data), { userId: userId.id, segmentId: Number(data.segmentId) }) });
};
class CreateCampaign {
    async execute({ data, userId }) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: userId.id },
            select: {
                campaigns: true,
                planMode: true,
                verified: true,
                status: true
            }
        });
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        if ((user === null || user === void 0 ? void 0 : user.planMode) === 'BASIC') {
            if (user.campaigns.length <= 1 && user.campaigns.length <= 20) {
                return await handleCreateCampaign({ data, userId });
            }
            else {
                throw new Error("Your subscription can create up to 20 campaigns");
            }
        }
        if ((user === null || user === void 0 ? void 0 : user.planMode) === 'PREMIUM') {
            if (user.campaigns.length <= 1 && user.campaigns.length <= 50) {
                return await handleCreateCampaign({ data, userId });
            }
            else {
                throw new Error("Your subscription can create up to 50 campaigns");
            }
        }
    }
}
exports.default = new CreateCampaign();
