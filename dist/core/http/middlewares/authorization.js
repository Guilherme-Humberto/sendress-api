"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretJWT = String(process.env.SECRET_JWT_FORMAT);
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: 'No token provided' });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).send({ error: 'Token error' });
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token malformatted' });
    }
    jsonwebtoken_1.default.verify(token, secretJWT, (err, decoded) => {
        if (err)
            return res.status(401).send({ error: 'Token invalid' });
        const request = req;
        request.userId = decoded === null || decoded === void 0 ? void 0 : decoded.id;
        return next();
    });
};
exports.authMiddleware = authMiddleware;
