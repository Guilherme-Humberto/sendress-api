"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCampaignEdit = exports.validateCampaignCreate = void 0;
const EmailValidator = __importStar(require("email-validator"));
const validateCampaignCreate = (data) => {
    const fieldEmpty = !data.name || !data.from || !data.to || !data.subject || !data.content;
    const fromAndToValidate = EmailValidator.validate(data.from) && EmailValidator.validate(data.to);
    const checkIfEqualFromAndTo = data.from === data.to;
    // const subjectLength = data.subject.length < 100
    // const contentLength = data.content.length < 800
    if (fieldEmpty) {
        return {
            status: false,
            message: "All fields are required"
        };
    }
    if (!fromAndToValidate) {
        return {
            status: false,
            message: `${data.from} or ${data.to} invalid`
        };
    }
    // if (subjectLength) {
    //     return {
    //         status: false,
    //         message: `Subject must have at least 100 letters`
    //     }
    // }
    // if (contentLength) {
    //     return {
    //         status: false,
    //         message: `Content must have at least 800 letters`
    //     }
    // }
    if (checkIfEqualFromAndTo) {
        return {
            status: false,
            message: `Invalid from or to values`
        };
    }
    return { status: true };
};
exports.validateCampaignCreate = validateCampaignCreate;
const validateCampaignEdit = (data) => {
    const checkIfEqualFromAndTo = data.from === data.to;
    if (data.from && !EmailValidator.validate(data.from)) {
        return {
            status: false,
            message: `from invalid`
        };
    }
    if (data.to && !EmailValidator.validate(data.to)) {
        return {
            status: false,
            message: `${data.to} invalid`
        };
    }
    if (checkIfEqualFromAndTo) {
        return {
            status: false,
            message: `From and to cannot be the same`
        };
    }
    return { status: true };
};
exports.validateCampaignEdit = validateCampaignEdit;
