"use strict";
// TODO: criar usuário e assinatura [x]
// TODO: atualizar usuário [x]
// TODO: deletar usuário / cancelar assinatura [x] 
// TODO: autenticação de usuários [x] 
// TODO: confirmação de cadastro do usuário [x]
// TODO: trocar senha do usuário [x]
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const SubscriptionUser_1 = __importDefault(require("../services/SubscriptionUser"));
const CreateSubscription_1 = __importDefault(require("../services/CreateSubscription"));
const Authentication_1 = __importDefault(require("../services/Authentication"));
const ConfirmPayment_1 = __importDefault(require("../services/ConfirmPayment"));
const RetrieveSubscription_1 = __importDefault(require("../services/RetrieveSubscription"));
const BillingSession_1 = __importDefault(require("../services/BillingSession"));
const authorization_1 = require("@core/http/middlewares/authorization");
const UpdateUser_1 = __importDefault(require("../services/UpdateUser"));
const ForgotPassword_1 = __importDefault(require("../services/ForgotPassword"));
const jobs_1 = require("cron/jobs");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
// Cadastro do usuário / envio de email para confirmação
userRouter.post('/register', async (req, res) => {
    try {
        const product = req.headers.product;
        const user = await SubscriptionUser_1.default.execute({
            userData: req.body,
            productId: String(product)
        });
        return res.json(user);
    }
    catch ({ message }) {
        return res.json({ message });
    }
});
// Atualizar cadastro do usuário
userRouter.put('/update', authorization_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.headers.userid;
        const userData = req.body;
        const user = await UpdateUser_1.default.execute({
            data: { id: Number(userId), userData }
        });
        return res.json(user);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
// Criação da assinatura do usuário
userRouter.get('/subscription', async (req, res) => {
    try {
        const { product, email, confirmation_token } = req.query;
        const session = await CreateSubscription_1.default.execute({
            data: { email: String(email) },
            productId: String(product),
            confirmation_token: String(confirmation_token)
        });
        return res.redirect(`http://localhost:3000/confirm?sessionId=${session.id}`);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
// Autenticação do usuário
userRouter.post('/login', async (req, res) => {
    try {
        const userData = req.body;
        const user = await Authentication_1.default.execute({
            data: userData,
        });
        return res.send(user);
    }
    catch ({ message }) {
        return res.send({ message });
    }
});
// Confirmação do cadastrato do usuário
userRouter.get('/confirm', async (req, res) => {
    try {
        const customerEmail = req.query.customer;
        const sessionId = req.query.session_id;
        await ConfirmPayment_1.default.execute({
            data: { email: customerEmail }, sessionId
        });
        return res.redirect(`${process.env.APP_URL}?withLogin=true`);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
// Retrieve user subscription
userRouter.get('/get_subscription', authorization_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.headers.userid;
        const customerId = req.headers.customerId;
        const subscription = await RetrieveSubscription_1.default.execute({
            data: { id: Number(userId), customerId }
        });
        return res.json(subscription);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
// Portal de gerenciamento da assinatura do usuário
userRouter.post('/billing_session', authorization_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.headers.userid;
        const customerId = req.headers.customerid;
        const { url: portalSessionUrl } = await BillingSession_1.default.execute({
            data: { id: Number(userId), customerId }
        });
        return res.json({ portalSessionUrl });
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
// Resetar senha do usuário
userRouter.post('/forgot_password', async (req, res) => {
    try {
        const data = req.body;
        const user = await ForgotPassword_1.default.execute({ data });
        return res.json({ user });
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
userRouter.get('/test', async (req, res) => {
    try {
        const users = (0, jobs_1.checkSubscriptionSituation)();
        return res.send(users);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
