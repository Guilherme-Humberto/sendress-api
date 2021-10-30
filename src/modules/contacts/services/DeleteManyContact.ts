import { prisma } from "config/prisma"

interface Props { userId: { id: number } }

class DeleteManyContacts {
    async execute({ userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id },
            select: { contacts: true, verified: true, status: true }
        })

        if (!user) throw new Error("User not found");

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        if (user.contacts.length <= 0) throw new Error("Contacts is required");

        const deleteContacts = user.contacts.map(async (contact) => {
            return await prisma.contact.deleteMany({
                where: { id: contact.id, userId: userId.id }
            })
        })

        return await Promise.all(deleteContacts)
    }
}

export default new DeleteManyContacts()