"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.senderRouter = void 0;
const authorization_1 = require("@core/http/middlewares/authorization");
const express_1 = __importDefault(require("express"));
const CreateSender_1 = __importDefault(require("../services/CreateSender"));
const ListSender_1 = __importDefault(require("../services/ListSender"));
const senderRouter = express_1.default.Router();
exports.senderRouter = senderRouter;
senderRouter.use(authorization_1.authMiddleware);
senderRouter.post('/create', async (req, res) => {
    try {
        const senderData = req.body;
        const userId = req.headers.userid;
        const sender = await CreateSender_1.default.execute({
            data: senderData,
            userId: { id: Number(userId) }
        });
        return res.send(sender);
    }
    catch ({ message }) {
        return res.status(400).send({ message });
    }
});
senderRouter.get('/listAll', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const segment = await ListSender_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.send(segment);
    }
    catch ({ message }) {
        return res.status(400).send({ message });
    }
});
