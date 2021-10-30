import { prisma } from "config/prisma"
import { ContactCreateInput } from "shared"

interface Props { data: ContactCreateInput; params: { id: number }; userId: { id: number } }

class UpdateContact {
    async execute({ data, params, userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const contact = await prisma.contact.findUnique({
            where: { id: params.id }
        })

        if (!contact) throw new Error("Contact not found")

        const contactUpdate = await prisma.contact.updateMany({
            where: { id: params.id, userId: userId.id }, data
        })

        return contactUpdate
    }
}

export default new UpdateContact()