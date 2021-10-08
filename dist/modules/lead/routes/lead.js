"use strict";
// TODO: create lead [x]
// TODO: update lead [x]
// TODO: listAll lead [x] 
// TODO: deleteMany lead [x] 
// TODO: delete by id lead [x] 
// TODO: import leads [x] 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const CreateLead_1 = __importDefault(require("../services/CreateLead"));
const ListLead_1 = __importDefault(require("../services/ListLead"));
const DeleteLead_1 = __importDefault(require("../services/DeleteLead"));
const DeleteManyLead_1 = __importDefault(require("../services/DeleteManyLead"));
const ImportLead_1 = __importDefault(require("../services/ImportLead"));
const UpdateLead_1 = __importDefault(require("../services/UpdateLead"));
const authorization_1 = require("@core/http/middlewares/authorization");
const leadRouter = express_1.default.Router();
exports.leadRouter = leadRouter;
const multerConfig = (0, multer_1.default)();
leadRouter.use(authorization_1.authMiddleware);
leadRouter.post('/create', async (req, res) => {
    try {
        const leadData = req.body;
        const userId = req.headers.userid;
        // const typeModel = req.headers.typemodel
        // if (!typeModel) return res.status(400).send({ error: 'typeModel is required' })
        const lead = await CreateLead_1.default.execute({
            data: leadData,
            userId: { id: Number(userId) }
        });
        return res.send(lead);
    }
    catch ({ message }) {
        return res.status(400).send({ message, status: false });
    }
});
leadRouter.get('/listAll', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const lead = await ListLead_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.send(lead);
    }
    catch ({ message }) {
        return res.status(400).send({ message, status: false });
    }
});
leadRouter.delete('/delete/:id', async (req, res) => {
    try {
        const leadParams = req.params;
        const userId = req.headers.userid;
        const lead = await DeleteLead_1.default.execute({
            params: { id: Number(leadParams.id) },
            userId: { id: Number(userId) }
        });
        return res.send(lead);
    }
    catch ({ message }) {
        return res.send({ error: message, status: false });
    }
});
leadRouter.delete('/deleteMany', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const lead = await DeleteManyLead_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.send(lead);
    }
    catch ({ message }) {
        return res.status(400).send({ message, status: false });
    }
});
leadRouter.post('/import', multerConfig.single('file'), async (req, res) => {
    try {
        const fileData = req.file;
        const userId = req.headers.userid;
        const typeModel = req.headers.typemodel;
        if (!typeModel)
            return res.status(400).send({ error: 'typeModel is required' });
        const importResponse = await ImportLead_1.default.execute({
            file: fileData,
            userId: { id: Number(userId) },
            typeModel: String(typeModel)
        });
        return res.json(importResponse);
    }
    catch ({ message }) {
        return res.status(400).json({
            status: false,
            message
        });
    }
});
leadRouter.put('/update/:id', async (req, res) => {
    try {
        const leadData = req.body;
        const leadParams = req.params;
        const userId = req.headers.userid;
        const lead = await UpdateLead_1.default.execute({
            data: leadData,
            userId: { id: Number(userId) },
            params: { id: Number(leadParams.id) }
        });
        return res.send(lead);
    }
    catch ({ message }) {
        return res.status(400).send({ message, status: false });
    }
});
