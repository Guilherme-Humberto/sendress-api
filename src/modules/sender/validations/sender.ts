import * as EmailValidator from 'email-validator';
import { SenderOutPut } from "shared";

const validateSender = (data: SenderOutPut) => {
    const fieldEmpty = !data.email || !data.title
    const isValidEmail = EmailValidator.validate(data.email)

    if (fieldEmpty) {
        return {
            status: false,
            message: 'Fields is required'
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

export { validateSender }