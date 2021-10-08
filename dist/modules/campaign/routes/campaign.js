"use strict";
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
        return res.status(400).send({ message });
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
        return res.status(400).send({ message });
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
        return res.status(400).send({ message });
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
        return res.status(400).send({ message });
    }
});
