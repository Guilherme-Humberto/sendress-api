import * as EmailValidator from 'email-validator';
import { CampaignOutPut } from "shared";

const validateCampaignCreate = (data: CampaignOutPut) => {
    const fieldEmpty = !data.name || !data.senderId || !data.subject || !data.content || !data.segmentId;
    // const subjectLength = data.subject.length < 100
    // const contentLength = data.content.length < 800

    if (fieldEmpty) {
        return {
            status: false,
            message: "All fields are required"
        }
    }

    // if (subjectLength) {
    //     return {
    //         status: false,
    //         message: `Subject must have at least 100 letters`
    //     }
    // }

    // if (contentLength) {
    //     return {
    //         status: false,
    //         message: `Content must have at least 800 letters`
    //     }
    // }

    return { status: true }
}

const validateCampaignEdit = (data: CampaignOutPut) => {

    return { status: true }
}

export { validateCampaignCreate, validateCampaignEdit }