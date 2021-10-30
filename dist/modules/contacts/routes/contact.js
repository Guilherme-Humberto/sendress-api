"use strict";
// TODO: Criar contato [x]
// TODO: Atualizar contato [x]
// TODO: Listar todos os contato [x] 
// TODO: Deletar contatos em massa [x] 
// TODO: Deletar contato [x] 
// TODO: Importar contatos [x] 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const CreateContact_1 = __importDefault(require("../services/CreateContact"));
const ListContact_1 = __importDefault(require("../services/ListContact"));
const DeleteContact_1 = __importDefault(require("../services/DeleteContact"));
const DeleteManyContact_1 = __importDefault(require("../services/DeleteManyContact"));
const ImportContact_1 = __importDefault(require("../services/ImportContact"));
const UpdateContact_1 = __importDefault(require("../services/UpdateContact"));
const authorization_1 = require("@core/http/middlewares/authorization");
const contactRouter = express_1.default.Router();
exports.contactRouter = contactRouter;
const multerConfig = (0, multer_1.default)();
contactRouter.use(authorization_1.authMiddleware);
contactRouter.post('/create', async (req, res) => {
    try {
        const contactData = req.body;
        const userId = req.headers.userid;
        // const typeModel = req.headers.typemodel
        // if (!typeModel) return res.status(400).send({ error: 'typeModel is required' })
        const contact = await CreateContact_1.default.execute({
            data: contactData,
            userId: { id: Number(userId) }
        });
        return res.send(contact);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
contactRouter.get('/listAll', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const contact = await ListContact_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.send(contact);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
contactRouter.delete('/delete/:id', async (req, res) => {
    try {
        const contactParams = req.params;
        const userId = req.headers.userid;
        const contact = await DeleteContact_1.default.execute({
            params: { id: Number(contactParams.id) },
            userId: { id: Number(userId) }
        });
        return res.send(contact);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
contactRouter.delete('/deleteMany', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const contact = await DeleteManyContact_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.send(contact);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
contactRouter.post('/import', multerConfig.single('file'), async (req, res) => {
    try {
        const fileData = req.file;
        const userId = req.headers.userid;
        const typeModel = req.headers.typemodel;
        if (!typeModel)
            return res.status(400).send({ error: 'typeModel is required' });
        const importResponse = await ImportContact_1.default.execute({
            file: fileData,
            userId: { id: Number(userId) },
            typeModel: String(typeModel)
        });
        return res.json(importResponse);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
contactRouter.put('/update/:id', async (req, res) => {
    try {
        const contactData = req.body;
        const contactParams = req.params;
        const userId = req.headers.userid;
        const contact = await UpdateContact_1.default.execute({
            data: contactData,
            userId: { id: Number(userId) },
            params: { id: Number(contactParams.id) }
        });
        return res.send(contact);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
