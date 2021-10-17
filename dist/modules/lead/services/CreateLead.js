"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
const lead_1 = require("../validations/lead");
class CreateLead {
    async execute({ data, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const lead = await prisma_1.prisma.lead.findUnique({
            where: { email: data.email }
        });
        if (lead)
            throw new Error("Lead already exists");
        const isValidLead = (0, lead_1.validateLead)(data);
        if (!isValidLead.status)
            throw new Error(isValidLead.message);
        const segmentDefault = await prisma_1.prisma.segment.findUnique({
            where: { title: 'Default' }
        });
        const segmentId = data.segmentId ? data.segmentId : segmentDefault === null || segmentDefault === void 0 ? void 0 : segmentDefault.id;
        return await prisma_1.prisma.lead.create({ data: Object.assign(Object.assign({}, data), { segmentId, userId: userId.id }) });
    }
}
exports.default = new CreateLead();
