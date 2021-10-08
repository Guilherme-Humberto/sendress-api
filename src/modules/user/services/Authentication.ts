import bcrypt from 'bcryptjs'
import { UserProps } from "@shared/index"
import { prisma } from "config/prisma"
import { generateJwt } from '../utils/generateJWT'

interface Request { data: UserProps }

class Authentication {
    async execute({ data }: Request) {
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (!user) throw new Error("User not found")

        const isValidPasswordFormat = await bcrypt.compare(data.password, user.password)

        if (!isValidPasswordFormat)
            throw new Error("Invalid password format")

        const token = generateJwt(data.email)

        return { user, token }
    }
}

export default new Authentication()