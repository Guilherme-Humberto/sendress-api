"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
const templates_1 = require("../validations/templates");
class CreateEmailTemplate {
    async execute({ data, userId }) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const template = await prisma_1.prisma.template.findFirst({
            where: { userId: userId.id, templateName: data.templateName }
        });
        if (template)
            throw new Error("Template already exists");
        const isValidTemplate = (0, templates_1.validateEmailTemplate)(data);
        if (!isValidTemplate.status)
            throw new Error(isValidTemplate.message);
        const newTemplate = await prisma_1.prisma.template.create({
            data: Object.assign({ userId: user.id }, data)
        });
        return newTemplate;
    }
}
exports.default = new CreateEmailTemplate();
