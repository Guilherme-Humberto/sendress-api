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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const EmailValidator = __importStar(require("email-validator"));
const prisma_1 = require("config/prisma");
const configure_1 = require("@core/stripe/configure");
const checkout_1 = require("@core/stripe/checkout");
class CreateSubscription {
    async execute({ data, confirmation_token, productId }) {
        const isValidEmail = EmailValidator.validate(data.email);
        if (!isValidEmail)
            throw new Error("Email invalid");
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email }
        });
        if (user === null || user === void 0 ? void 0 : user.verified)
            throw new Error("User already verified");
        if (!user)
            throw new Error("User not found");
        const isValidHash = bcryptjs_1.default.compareSync(data.email, confirmation_token);
        if (!isValidHash)
            throw new Error("Invalid hash");
        const stripeSession = (0, configure_1.stripe)();
        const getPrices = await stripeSession.prices.list({ product: productId });
        return await (0, checkout_1.createCheckoutSession)({
            prices: getPrices,
            customer: data.email
        });
    }
}
exports.default = new CreateSubscription();
