"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class DeleteSchedule {
    async execute({ scheduleId, userId }) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: userId.id },
            select: {
                campaigns: true,
                verified: true,
                status: true
            }
        });
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        return await prisma_1.prisma.schedule.deleteMany({
            where: { id: scheduleId.id, userId: userId.id }
        });
    }
}
exports.default = new DeleteSchedule();
