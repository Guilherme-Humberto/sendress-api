import * as EmailValidator from 'email-validator';
import { CampaignOutPut } from "shared";

const validateCampaignCreate = (data: CampaignOutPut) => {
    const fieldEmpty = !data.name || !data.from || !data.subject || !data.content || !data.segmentId;
    const fromAndToValidate = EmailValidator.validate(data.from)
    // const subjectLength = data.subject.length < 100
    // const contentLength = data.content.length < 800

    if (fieldEmpty) {
        return {
            status: false,
            message: "All fields are required"
        }
    }

    if (!fromAndToValidate) {
        return {
            status: false,
            message: `${data.from} invalid`
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
    if(data.from && !EmailValidator.validate(data.from)) {
        return {
            status: false,
            message: `from invalid`
        }
    }

    return { status: true }
}

export { validateCampaignCreate, validateCampaignEdit }