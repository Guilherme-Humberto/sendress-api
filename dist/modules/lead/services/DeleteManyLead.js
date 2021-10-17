"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class DeleteManyLead {
    async execute({ userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id },
            select: { leads: true, verified: true, status: true }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        if (user.leads.length <= 0)
            throw new Error("Leads is required");
        const deleteLeads = user.leads.map(async (lead) => {
            return await prisma_1.prisma.lead.deleteMany({
                where: { id: lead.id, userId: userId.id }
            });
        });
        return await Promise.all(deleteLeads);
    }
}
exports.default = new DeleteManyLead();
