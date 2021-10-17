"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class UpdateLead {
    async execute({ data, params, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const lead = await prisma_1.prisma.lead.findUnique({
            where: { id: params.id }
        });
        if (!lead)
            throw new Error("Lead not found");
        const leadUpdate = await prisma_1.prisma.lead.updateMany({
            where: { id: params.id, userId: userId.id }, data
        });
        return leadUpdate;
    }
}
exports.default = new UpdateLead();
