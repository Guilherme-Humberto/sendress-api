"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailTemplate = void 0;
const validateEmailTemplate = (data) => {
    const fieldEmpty = !data.templateName || !data.htmlPart;
    if (fieldEmpty) {
        return {
            status: false,
            message: 'templateName and htmlPart is required'
        };
    }
    return { status: true, message: 'is Valid' };
};
exports.validateEmailTemplate = validateEmailTemplate;
