"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const aws_ses_1 = __importDefault(require("@config/aws-ses"));
aws_sdk_1.default.config.update({
    accessKeyId: aws_ses_1.default.access_key,
    secretAccessKey: aws_ses_1.default.secret_key,
    region: aws_ses_1.default.region
});
const mailService = new aws_sdk_1.default.SES({ apiVersion: '2010-12-01' });
exports.mailService = mailService;
