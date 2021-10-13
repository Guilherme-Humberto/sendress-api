"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const aws_sqs_1 = __importDefault(require("@config/aws-sqs"));
aws_sdk_1.default.config.update({
    accessKeyId: aws_sqs_1.default.access_key,
    secretAccessKey: aws_sqs_1.default.secret_key,
    region: aws_sqs_1.default.region
});
const queueService = new aws_sdk_1.default.SQS();
exports.queueService = queueService;
