"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ses_1 = require("@core/aws/aws-ses");
class ListTemplates {
    async execute() {
        const { TemplatesMetadata: listTemplates } = await aws_ses_1.mailService.listTemplates().promise();
        const listTemplatesResponse = listTemplates;
        const getTemplates = listTemplatesResponse.map(async (template) => {
            return await aws_ses_1.mailService.getTemplate({ TemplateName: String(template.Name) }).promise();
        });
        return await Promise.all(getTemplates);
    }
}
exports.default = new ListTemplates();
