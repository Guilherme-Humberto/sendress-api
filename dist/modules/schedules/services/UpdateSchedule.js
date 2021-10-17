"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class UpdateSchedule {
    async execute({ data, userId, scheduleId }) {
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
        return await prisma_1.prisma.schedule.updateMany({
            where: { id: scheduleId.id, userId: userId.id }, data
        });
    }
}
exports.default = new UpdateSchedule();
