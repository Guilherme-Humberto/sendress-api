"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class UpdateContact {
    async execute({ data, params, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const contact = await prisma_1.prisma.contact.findUnique({
            where: { id: params.id }
        });
        if (!contact)
            throw new Error("Contact not found");
        const contactUpdate = await prisma_1.prisma.contact.updateMany({
            where: { id: params.id, userId: userId.id }, data
        });
        return contactUpdate;
    }
}
exports.default = new UpdateContact();
