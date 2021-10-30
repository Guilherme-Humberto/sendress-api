"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
const schedule_1 = require("../validations/schedule");
class CreateSchedule {
    async execute({ data, userId }) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: userId.id },
            select: {
                id: true,
                campaigns: true,
                planMode: true,
                verified: true,
                status: true
            }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const findSchedule = await prisma_1.prisma.schedule.findFirst({
            where: {
                userId: userId.id,
                segmentId: Number(data.segmentId),
                campaignId: Number(data.campaignId)
            }
        });
        if (findSchedule)
            throw new Error('Schedule already exists');
        if (data.dates === null || data.dates === [])
            throw new Error('Dates is required');
        const isValidScheduleData = (0, schedule_1.validateSchedule)(data, userId.id);
        if (!isValidScheduleData.status)
            throw new Error(isValidScheduleData.message);
        return await prisma_1.prisma.schedule.create({ data: Object.assign(Object.assign({}, data), { userId: user.id }) });
    }
}
exports.default = new CreateSchedule();
