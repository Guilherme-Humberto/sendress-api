"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretJWT = String(process.env.SECRET_JWT_FORMAT);
const generateJwt = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user }, secretJWT, {
        expiresIn: '1d'
    });
};
exports.generateJwt = generateJwt;
