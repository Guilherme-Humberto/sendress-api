"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const configure_1 = require("@core/stripe/configure");
const prisma_1 = require("config/prisma");
const emailConfirmation_1 = require("../utils/emailConfirmation");
const user_1 = require("../validations/user");
class SubscriptionUser {
    async execute({ userData, productId }) {
        const stripe = (0, configure_1.stripe)();
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: userData.email }
        });
        const { data: userStripe } = await stripe.customers.list({
            email: userData.email
        });
        if (user || userStripe.length >= 1)
            throw new Error("User alreary exists");
        const isValidUser = (0, user_1.validateUser)(userData);
        if (!isValidUser.status)
            throw new Error(isValidUser.message);
        const generateToken = bcryptjs_1.default.hashSync(userData.email, 10);
        await (0, emailConfirmation_1.sendEmailConfirmation)({
            to: userData.email,
            from: String(process.env.EMAIL_FROM_ADMIN),
            subject: 'Confirmação de cadastro',
            username: userData.name,
            useremail: userData.email,
            token: generateToken,
            productId
        });
        const hashPass = bcryptjs_1.default.hashSync(userData.password, 10);
        return await prisma_1.prisma.user.create({
            data: Object.assign(Object.assign({}, userData), { password: hashPass, customerId: 'pending', accessToken: 'pending' })
        });
    }
}
exports.default = new SubscriptionUser();
