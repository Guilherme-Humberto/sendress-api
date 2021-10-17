"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class CreateSchedule {
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
        const findSchedule = await prisma_1.prisma.schedule.findFirst({
            where: { segmentId: data.segmentId, campaignId: data.campaignId }
        });
        if (findSchedule)
            throw new Error('Schedule already exists');
        return await prisma_1.prisma.schedule.create({ data: Object.assign(Object.assign({}, data), { userId: userId.id }) });
    }
}
exports.default = new CreateSchedule();
