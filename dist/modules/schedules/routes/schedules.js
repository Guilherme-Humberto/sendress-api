"use strict";
// TODO: Criar agenda [x]
// TODO: Atualizar agenda [x]
// TODO: Listar todos as agenda [x]
// TODO: Deletar agenda [x]
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleRouter = void 0;
const express_1 = __importDefault(require("express"));
const CreateSchedule_1 = __importDefault(require("../services/CreateSchedule"));
const ListSchedule_1 = __importDefault(require("../services/ListSchedule"));
const UpdateSchedule_1 = __importDefault(require("../services/UpdateSchedule"));
const DeleteSchedule_1 = __importDefault(require("../services/DeleteSchedule"));
const authorization_1 = require("@core/http/middlewares/authorization");
const scheduleRouter = express_1.default.Router();
exports.scheduleRouter = scheduleRouter;
scheduleRouter.use(authorization_1.authMiddleware);
scheduleRouter.post('/create', async (req, res) => {
    try {
        const scheduleData = req.body;
        const userId = req.headers.userid;
        const schedule = await CreateSchedule_1.default.execute({
            data: scheduleData,
            userId: { id: Number(userId) }
        });
        return res.send(schedule);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
scheduleRouter.get('/listAll', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const schedule = await ListSchedule_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.send(schedule);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
scheduleRouter.put('/update/:id', async (req, res) => {
    try {
        const scheduleData = req.body;
        const userId = req.headers.userid;
        const scheduleId = req.params.id;
        const schedule = await UpdateSchedule_1.default.execute({
            data: scheduleData,
            userId: { id: Number(userId) },
            scheduleId: { id: Number(scheduleId) }
        });
        return res.send(schedule);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
scheduleRouter.delete('/delete/:id', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const scheduleId = req.params.id;
        const schedule = await DeleteSchedule_1.default.execute({
            userId: { id: Number(userId) },
            scheduleId: { id: Number(scheduleId) }
        });
        return res.send(schedule);
    }
    catch ({ message }) {
        return res.json({ error: message, status: false });
    }
});
