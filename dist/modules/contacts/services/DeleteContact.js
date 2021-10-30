"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class DeleteContact {
    async execute({ params, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const contact = await prisma_1.prisma.contact.findFirst({
            where: { id: params.id, userId: userId.id }
        });
        if (!contact)
            throw new Error("Contact not found");
        await prisma_1.prisma.contact.deleteMany({
            where: { id: params.id, userId: userId.id }
        });
        return { status: true };
    }
}
exports.default = new DeleteContact();
