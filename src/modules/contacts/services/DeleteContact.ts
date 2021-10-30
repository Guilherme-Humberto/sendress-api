import { prisma } from "config/prisma"

interface Props { params: { id: number }, userId: { id: number } }

class DeleteContact {
    async execute({ params, userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const contact = await prisma.contact.findFirst({
            where: { id: params.id, userId: userId.id }
        })

        if (!contact) throw new Error("Contact not found")

        await prisma.contact.deleteMany({
            where: { id: params.id, userId: userId.id }
        })

        return { status: true }
    }
}

export default new DeleteContact()