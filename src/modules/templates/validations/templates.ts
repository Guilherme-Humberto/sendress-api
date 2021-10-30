import { TemplateCreateManyInput } from "shared";

const validateEmailTemplate = (data: TemplateCreateManyInput) => {
    const fieldEmpty = !data.templateName || !data.htmlPart

    if (fieldEmpty) {
        return {
            status: false,
            message: 'templateName and htmlPart is required'
        }
    }
    
    return { status: true, message: 'is Valid' }
}

export { validateEmailTemplate }