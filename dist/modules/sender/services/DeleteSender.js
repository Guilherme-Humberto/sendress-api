"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailValidator = __importStar(require("email-validator"));
const prisma_1 = require("config/prisma");
const aws_ses_1 = require("@core/aws/aws-ses");
class CreateSender {
    async execute({ emails, userId }) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: userId.email },
            select: { senders: true, id: true }
        });
        if (!user)
            throw new Error('User not found');
        const deleteEmails = emails.map(async (email) => {
            const sender = await prisma_1.prisma.sender.findUnique({
                where: { email }
            });
            if (!sender) {
                return {
                    status: false,
                    message: `${email} not found`
                };
            }
            const isValidEmail = EmailValidator.validate(email);
            if (!isValidEmail) {
                return {
                    status: false,
                    message: `${email} invalid`
                };
            }
            await prisma_1.prisma.sender.delete({
                where: { email }
            });
            await aws_ses_1.mailService.deleteVerifiedEmailAddress({
                EmailAddress: email
            }).promise();
            return { status: true };
        });
        return await Promise.all(deleteEmails);
    }
}
exports.default = new CreateSender();
