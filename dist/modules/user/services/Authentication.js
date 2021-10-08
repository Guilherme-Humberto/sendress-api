"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("config/prisma");
const generateJWT_1 = require("../utils/generateJWT");
class Authentication {
    async execute({ data }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user)
            throw new Error("User not found");
        const isValidPasswordFormat = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isValidPasswordFormat)
            throw new Error("Invalid password format");
        const token = (0, generateJWT_1.generateJwt)(data.email);
        return { user, token };
    }
}
exports.default = new Authentication();
