import * as EmailValidator from 'email-validator';
import { CampaignOutPut } from "shared";

const validateCampaignCreate = (data: CampaignOutPut) => {
    const fieldEmpty = !data.name || !data.from || !data.to || !data.subject || !data.content;
    const fromAndToValidate = EmailValidator.validate(data.from) && EmailValidator.validate(data.to)
    const checkIfEqualFromAndTo = data.from === data.to
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
            message: `${data.from} or ${data.to} invalid`
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

    if (checkIfEqualFromAndTo) {
        return {
            status: false,
            message: `Invalid from or to values`
        }
    }

    return { status: true }
}

const validateCampaignEdit = (data: CampaignOutPut) => {
    const checkIfEqualFromAndTo = data.from === data.to

    if(data.from && !EmailValidator.validate(data.from)) {
        return {
            status: false,
            message: `from invalid`
        }
    }

    if(data.to && !EmailValidator.validate(data.to)) {
        return {
            status: false,
            message: `${data.to} invalid`
        }
    }

    if (checkIfEqualFromAndTo) {
        return {
            status: false,
            message: `From and to cannot be the same`
        }
    }

    return { status: true }
}

export { validateCampaignCreate, validateCampaignEdit }