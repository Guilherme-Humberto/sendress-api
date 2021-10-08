"use strict";
// TODO: create segment [x]
// TODO: update segment [x]
// TODO: listAll segment [x] 
// TODO: deleteMany segment [x] 
// TODO: delete by id segment [x]
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.segmentRouter = void 0;
const express_1 = __importDefault(require("express"));
const CreateSegment_1 = __importDefault(require("../services/CreateSegment"));
const ListSegment_1 = __importDefault(require("../services/ListSegment"));
const DeleteSegment_1 = __importDefault(require("../services/DeleteSegment"));
const DeleteSegmentMany_1 = __importDefault(require("../services/DeleteSegmentMany"));
const UpdateSegment_1 = __importDefault(require("../services/UpdateSegment"));
const authorization_1 = require("@core/http/middlewares/authorization");
const segmentRouter = express_1.default.Router();
exports.segmentRouter = segmentRouter;
segmentRouter.use(authorization_1.authMiddleware);
segmentRouter.post('/create', async (req, res) => {
    try {
        const segmentData = req.body;
        const userId = req.headers.userid;
        const segment = await CreateSegment_1.default.execute({
            data: segmentData,
            userId: { id: Number(userId) }
        });
        return res.send(segment);
    }
    catch ({ message }) {
        return res.status(400).send({ message });
    }
});
segmentRouter.get('/listAll', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const segment = await ListSegment_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.send(segment);
    }
    catch ({ message }) {
        return res.send({ error: message });
    }
});
segmentRouter.delete('/delete/:id', async (req, res) => {
    try {
        const segmentId = req.params.id;
        const userId = req.headers.userid;
        const segment = await DeleteSegment_1.default.execute({
            params: { id: Number(segmentId) },
            userId: { id: Number(userId) }
        });
        return res.send(segment);
    }
    catch ({ message }) {
        return res.status(400).send({ message });
    }
});
segmentRouter.delete('/deleteMany', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const segment = await DeleteSegmentMany_1.default.execute({
            userId: { id: Number(userId) }
        });
        return res.send(segment);
    }
    catch ({ message }) {
        return res.status(400).send({ message });
    }
});
segmentRouter.put('/update/:id', async (req, res) => {
    try {
        const segmentData = req.body;
        const segmentId = req.params.id;
        const userId = req.headers.userid;
        const segment = await UpdateSegment_1.default.execute({
            data: segmentData,
            userId: { id: Number(userId) },
            params: { id: Number(segmentId) },
        });
        return res.send(segment);
    }
    catch ({ message }) {
        return res.status(400).send({ message });
    }
});
