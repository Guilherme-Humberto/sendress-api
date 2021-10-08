import { prisma } from "config/prisma"
import { UserProps } from '@shared/index'

interface Props { data: { id: number, userData: UserProps } }

class UpdateUser {
    async execute({ data }: Props) {
        return await prisma.user.update({
            where: { id: data.id },
            data: { ...data.userData }
        })
    }
}

export default new UpdateUser()