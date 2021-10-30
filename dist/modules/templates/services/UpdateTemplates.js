"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("@config/prisma");
class UpdateTemplates {
    async execute({ userId, data, templateId }) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        return await prisma_1.prisma.template.updateMany({
            where: { id: templateId.id },
            data
        });
    }
}
exports.default = new UpdateTemplates();
