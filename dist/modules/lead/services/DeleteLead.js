"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class DeleteLead {
    async execute({ params, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        const lead = await prisma_1.prisma.lead.findFirst({
            where: { id: params.id, userId: userId.id }
        });
        if (!lead)
            throw new Error("Lead not found");
        await prisma_1.prisma.lead.deleteMany({
            where: { id: params.id, userId: userId.id }
        });
        return { status: true };
    }
}
exports.default = new DeleteLead();
