import * as EmailValidator from 'email-validator';
import { cpf as CPF } from 'cpf-cnpj-validator'
import { UserProps } from "shared";

const validateUser = (data: UserProps) => {
    const fieldEmpty = !data.email || !data.document || !data.name || !data.password
    const isValidEmail = EmailValidator.validate(data.email)

    const minPassword = data.password.length <= 5

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

    if (!CPF.isValid(data.document)) {
        return {
            status: false,
            message: `${data.document} invalid`
        }
    }

    if (minPassword) {
        return {
            status: false,
            message: `The password must have at least 5 digits`
        }
    }

    return { status: true }
}

export { validateUser }