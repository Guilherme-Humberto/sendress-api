// Resetar senha do usuário

import bcrypt from 'bcryptjs'
import { prisma } from "config/prisma"
import { UserProps } from "@shared/index"

interface Props { data: UserProps }

class ForgotPassword {
    async execute({ data }: Props) {
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if(!user) throw new Error("User not found")

        const hashPass = bcrypt.hashSync(data.password, 10)

        return await prisma.user.update({
            where: { email: data.email },
            data: { password: hashPass }
        })
    }
}

export default new ForgotPassword()