"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("config/prisma");
class SenderSegment {
    async execute() {
        return await prisma_1.prisma.sender.findMany();
    }
}
exports.default = new SenderSegment();
