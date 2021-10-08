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
Object.defineProperty(exports, "__esModule", { value: true });
const aws_1 = require("./aws");
exports.default = {
    async handle(_a) {
        var data = __rest(_a, []);
        return await aws_1.mailService.sendEmail({
            Source: `${data.from}`,
            Destination: {
                ToAddresses: [`${data.to}`]
            },
            Message: {
                Subject: {
                    Data: `${data.subject}`
                },
                Body: {
                    Text: {
                        Data: `${data.content}`
                    }
                }
            },
        }).promise();
    },
};
