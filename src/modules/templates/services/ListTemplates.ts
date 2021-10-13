import { mailService } from "@core/aws/aws-ses"
import { SES } from "aws-sdk"

class ListTemplates {
    async execute() {
        const { TemplatesMetadata: listTemplates } = await mailService.listTemplates().promise()

        const listTemplatesResponse = listTemplates as SES.TemplateMetadataList

        const getTemplates = listTemplatesResponse.map(async template => {
            return await mailService.getTemplate({ TemplateName: String(template.Name) }).promise()
        })
        
        return await Promise.all(getTemplates)
    }
}

export default new ListTemplates()