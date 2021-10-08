"use strict";
// Resetar senha do usuário
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("config/prisma");
class ForgotPassword {
    async execute({ data }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user)
            throw new Error("User not found");
        const hashPass = bcryptjs_1.default.hashSync(data.password, 10);
        return await prisma_1.prisma.user.update({
            where: { email: data.email },
            data: { password: hashPass }
        });
    }
}
exports.default = new ForgotPassword();
