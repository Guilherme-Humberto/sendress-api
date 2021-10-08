import * as EmailValidator from 'email-validator';
import { LeadCreateInput } from "shared";

const validateLead = (data: LeadCreateInput) => {
    const fieldEmpty = !data.email
    const isValidEmail = EmailValidator.validate(data.email)

    if (fieldEmpty) {
        return {
            status: false,
            message: 'Email is required'
        }
    }

    if (!isValidEmail) {
        return {
            status: false,
            message: 'Email invalid'
        }
    }

    return { status: true }
}

export { validateLead }