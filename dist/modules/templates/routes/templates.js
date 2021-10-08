"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateRouter = void 0;
const express_1 = __importDefault(require("express"));
const ListTemplates_1 = __importDefault(require("../services/ListTemplates"));
const CreateEmailTemplate_1 = __importDefault(require("../services/CreateEmailTemplate"));
const templateRouter = express_1.default.Router();
exports.templateRouter = templateRouter;
templateRouter.get('/listAll', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const listTemplates = await ListTemplates_1.default.execute({ userId: { id: Number(userId) } });
        return res.json(listTemplates);
    }
    catch ({ message }) {
        return res.status(400).send({ message });
    }
});
templateRouter.post('/create', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const listTemplates = await CreateEmailTemplate_1.default.execute();
        return res.json(listTemplates);
    }
    catch ({ message }) {
        return res.status(400).send({ message });
    }
});
