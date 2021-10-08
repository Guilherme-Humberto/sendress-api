import { prisma } from "config/prisma"

class SenderSegment {
    async execute() {
        return await prisma.sender.findMany()
    }
}

export default new SenderSegment()