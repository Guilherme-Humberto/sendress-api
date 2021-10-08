"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
const handleListTemplates = async (userId) => {
    return await prisma_1.prisma.emailTemplate.findMany({
        where: { userId }
    });
};
class ListTemplates {
    async execute({ userId }) {
        if (userId) {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId.id }
            });
            if (!user)
                throw new Error("User not found");
            await handleListTemplates(user.id);
        }
        return await handleListTemplates();
    }
}
exports.default = new ListTemplates();
