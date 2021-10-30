import * as EmailValidator from 'email-validator';
import { ContactCreateInput } from "shared";

const validateContact = (data: ContactCreateInput) => {
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

export { validateContact }