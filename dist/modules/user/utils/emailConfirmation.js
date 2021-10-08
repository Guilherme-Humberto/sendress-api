"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailConfirmation = void 0;
const aws_1 = require("@core/aws/aws");
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sendEmailConfirmation = async (_a) => {
    var data = __rest(_a, []);
    fs_1.default.readFile(path_1.default.resolve(__dirname, './email-confirmation.html'), async (err, emailHtmlTemplate) => {
        if (err) {
            console.log("Unable to load HTML Template");
            throw err;
        }
        var emailData = {
            "username": data.username,
            "useremail": data.useremail,
            "productId": data.productId,
            "token": String(data.token)
        };
        var templateHtml = handlebars_1.default.compile(emailHtmlTemplate.toString());
        var bodyHtml = templateHtml(emailData);
        await aws_1.mailService.sendEmail({
            Source: `${data.from}`,
            Destination: {
                ToAddresses: [`${data.to}`]
            },
            Message: {
                Subject: {
                    Data: `${data.subject}`
                },
                Body: {
                    Html: {
                        Data: bodyHtml
                    }
                }
            },
        }).promise();
    });
    return { status: true };
};
exports.sendEmailConfirmation = sendEmailConfirmation;
