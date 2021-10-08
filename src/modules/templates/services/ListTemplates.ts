import { prisma } from "config/prisma"


interface Props {
    userId: { id: number }
}

const handleListTemplates = async (userId?: number) => {
    return await prisma.emailTemplate.findMany({
        where: { userId }
    })
}

class ListTemplates {
    async execute({ userId }: Props) {
        if(userId) {
            const user = await prisma.user.findUnique({
                where: { id: userId.id }
            })

            if(!user) throw new Error("User not found")

            await handleListTemplates(user.id)
        }

        return await handleListTemplates()
    }
}

export default new ListTemplates()