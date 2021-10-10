"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_1 = require("@core/aws/aws");
class ListTemplates {
    async execute() {
        const { TemplatesMetadata: listTemplates } = await aws_1.mailService.listTemplates().promise();
        const listTemplatesResponse = listTemplates;
        const getTemplates = listTemplatesResponse.map(async (template) => {
            return await aws_1.mailService.getTemplate({ TemplateName: String(template.Name) }).promise();
        });
        return await Promise.all(getTemplates);
    }
}
exports.default = new ListTemplates();
