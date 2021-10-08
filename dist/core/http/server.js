"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const app_1 = require("./app");
const logger_1 = require("@config/logger");
const port = process.env.PORT || 3333;
if (cluster_1.default.isPrimary) {
    for (let i = 0; i < os_1.default.cpus.length; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', () => logger_1.logger.info(`worker ${process.pid} died`));
}
else {
    app_1.app.listen(port, () => logger_1.logger.info(`Server is running on port ${port}\n`));
}
