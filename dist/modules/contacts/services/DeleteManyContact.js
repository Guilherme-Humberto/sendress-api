"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class DeleteManyContacts {
    async execute({ userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id },
            select: { contacts: true, verified: true, status: true }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        if (user.contacts.length <= 0)
            throw new Error("Contacts is required");
        const deleteContacts = user.contacts.map(async (contact) => {
            return await prisma_1.prisma.contact.deleteMany({
                where: { id: contact.id, userId: userId.id }
            });
        });
        return await Promise.all(deleteContacts);
    }
}
exports.default = new DeleteManyContacts();
