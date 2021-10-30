import { prisma } from "config/prisma"
import { ContactCreateManyInput } from "shared"
import { validateContact } from "../validations/contact"

interface Props { data: ContactCreateManyInput, userId: { id: number } }

class CreateContact {
    async execute({ data, userId }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found")

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const contact = await prisma.contact.findUnique({
            where: { email: data.email }
        })

        if (contact) throw new Error("Contact already exists")

        const isValidContact = validateContact(data)

        if (!isValidContact.status) throw new Error(isValidContact.message)

        const segmentDefault = await prisma.segment.findUnique({
            where: { title: 'Default' }
        })

        const segmentId = data.segmentId ? data.segmentId : segmentDefault?.id
        return await prisma.contact.create({ data: { ...data, segmentId, userId: userId.id } })
    }
}

export default new CreateContact()