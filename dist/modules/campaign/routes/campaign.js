"use strict";
// TODO: Criar campanha [x]
// TODO: Atualizar campanha [x]
// TODO: Listar todos as campanha [x]
// TODO: Deletar campanha [x]
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignRouter = void 0;
const express_1 = __importDefault(require("express"));
const CreateCampaign_1 = __importDefault(require("../services/CreateCampaign"));
const ListCampaign_1 = __importDefault(require("../services/ListCampaign"));
const DeleteCampaign_1 = __importDefault(require("../services/DeleteCampaign"));
const UpdateCampaign_1 = __importDefault(require("../services/UpdateCampaign"));
const DeleteManyCampaigns_1 = __importDefault(require("../services/DeleteManyCampaigns"));
const SendCampaigns_1 = __importDefault(require("../services/SendCampaigns"));
const authorization_1 = require("@core/http/middlewares/authorization");
const campaignRouter = express_1.default.Router();
exports.campaignRouter = campaignRouter;
campaignRouter.use(authorization_1.authMiddleware);
campaignRouter.post('/create', async (req, res) => {
    try {
        const campaignData = req.body;
        const userId = req.headers.userid;
        const campaign = await CreateCampaign_1.default.execute({
            data: campaignData,
            userId: { id: Number(userId) }
        });
        return res.send(campaign);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
campaignRouter.get('/listAll', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const campaign = await ListCampaign_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.send(campaign);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
campaignRouter.delete('/delete/:id', async (req, res) => {
    try {
        const campaignParams = req.params.id;
        const userId = req.headers.userid;
        const campaign = await DeleteCampaign_1.default.execute({
            params: { id: Number(campaignParams) },
            userId: { id: Number(userId) }
        });
        return res.send(campaign);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
campaignRouter.put('/update/:id', async (req, res) => {
    try {
        const campaignBody = req.body;
        const campaignParams = req.params;
        const userId = req.headers.userid;
        const campaign = await UpdateCampaign_1.default.execute({
            data: campaignBody,
            userId: { id: Number(userId) },
            params: { id: Number(campaignParams.id) }
        });
        return res.send(campaign);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
campaignRouter.delete('/deleteMany', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const contact = await DeleteManyCampaigns_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.send(contact);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
// Get campaign id
campaignRouter.post('/send', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const campaignid = req.headers.campaignid;
        const senderid = req.headers.senderid;
        const contact = await SendCampaigns_1.default.execute({
            userId: { id: Number(userId) },
            campaignId: { id: Number(campaignid) },
            senderId: { id: Number(senderid) }
        });
        return res.send(contact);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
