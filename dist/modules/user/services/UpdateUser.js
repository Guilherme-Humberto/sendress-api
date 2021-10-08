"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class UpdateUser {
    async execute({ data }) {
        return await prisma_1.prisma.user.update({
            where: { id: data.id },
            data: Object.assign({}, data.userData)
        });
    }
}
exports.default = new UpdateUser();
