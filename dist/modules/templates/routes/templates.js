"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateRouter = void 0;
const express_1 = __importDefault(require("express"));
const ListTemplates_1 = __importDefault(require("../services/ListTemplates"));
const AWSListTemplates_1 = __importDefault(require("../services/AWSListTemplates"));
const CreateEmailTemplate_1 = __importDefault(require("../services/CreateEmailTemplate"));
const DeleteTemplate_1 = __importDefault(require("../services/DeleteTemplate"));
const UpdateTemplates_1 = __importDefault(require("../services/UpdateTemplates"));
const templateRouter = express_1.default.Router();
exports.templateRouter = templateRouter;
templateRouter.get('/listAll', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const listTemplates = await ListTemplates_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.json(listTemplates);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
templateRouter.get('/aws/listAll', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const listAwsTemplates = await AWSListTemplates_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.json(listAwsTemplates);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
templateRouter.post('/create', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const templateData = req.body;
        const template = await CreateEmailTemplate_1.default.execute({
            data: templateData,
            userId: { id: Number(userId) }
        });
        return res.json(template);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
templateRouter.delete('/delete', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const templateId = req.headers.templateid;
        await DeleteTemplate_1.default.execute({
            templateId: { id: Number(templateId) },
            userId: { id: Number(userId) }
        });
        return res.json({ status: true, message: 'Template deleted' });
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
templateRouter.put('/update', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const templateId = req.headers.templateid;
        const templateData = req.body;
        const updateTemplate = await UpdateTemplates_1.default.execute({
            templateId: { id: Number(templateId) },
            userId: { id: Number(userId) },
            data: templateData
        });
        return res.json(updateTemplate);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
