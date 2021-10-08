"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_1 = require("@core/aws/aws");
class CreateEmailTemplate {
    async execute() {
        return await aws_1.mailService.createTemplate({
            Template: {
                TemplateName: "MyTemplate",
                SubjectPart: "Greetings, {{name}}!",
                HtmlPart: "<h1>Hello {{name}},</h1><p>Your favorite animal is {{favoriteanimal}}.</p>",
                TextPart: "Dear {{name}},\r\nYour favorite animal is {{favoriteanimal}}."
            }
        }).promise();
    }
}
exports.default = new CreateEmailTemplate();
