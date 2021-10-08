"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class CreateSegment {
    async execute({ data, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        const segment = await prisma_1.prisma.segment.findUnique({
            where: { title: data.title }
        });
        if (segment)
            throw new Error("List alreay exists");
        return await prisma_1.prisma.segment.create({ data: Object.assign(Object.assign({}, data), { userId: userId.id }) });
    }
}
exports.default = new CreateSegment();
