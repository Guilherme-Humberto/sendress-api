"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("@config/prisma");
const aws_ses_1 = require("@core/aws/aws-ses");
class AWSListTemplates {
    async execute({ userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const { TemplatesMetadata: getListTemplates } = await aws_ses_1.mailService.listTemplates().promise();
        const findTemplates = getListTemplates === null || getListTemplates === void 0 ? void 0 : getListTemplates.map(async (template) => {
            return await aws_ses_1.mailService.getTemplate({ TemplateName: String(template === null || template === void 0 ? void 0 : template.Name) }).promise();
        });
        return await Promise.all(findTemplates);
    }
}
exports.default = new AWSListTemplates();
