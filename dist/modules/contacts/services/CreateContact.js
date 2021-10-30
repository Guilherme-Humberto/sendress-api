"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
const contact_1 = require("../validations/contact");
class CreateContact {
    async execute({ data, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const contact = await prisma_1.prisma.contact.findUnique({
            where: { email: data.email }
        });
        if (contact)
            throw new Error("Contact already exists");
        const isValidContact = (0, contact_1.validateContact)(data);
        if (!isValidContact.status)
            throw new Error(isValidContact.message);
        const segmentDefault = await prisma_1.prisma.segment.findUnique({
            where: { title: 'Default' }
        });
        const segmentId = data.segmentId ? data.segmentId : segmentDefault === null || segmentDefault === void 0 ? void 0 : segmentDefault.id;
        return await prisma_1.prisma.contact.create({ data: Object.assign(Object.assign({}, data), { segmentId, userId: userId.id }) });
    }
}
exports.default = new CreateContact();
