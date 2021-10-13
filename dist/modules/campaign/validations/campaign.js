"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCampaignEdit = exports.validateCampaignCreate = void 0;
const validateCampaignCreate = (data) => {
    const fieldEmpty = !data.name || !data.senderId || !data.subject || !data.content || !data.segmentId;
    // const subjectLength = data.subject.length < 100
    // const contentLength = data.content.length < 800
    if (fieldEmpty) {
        return {
            status: false,
            message: "All fields are required"
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
    return { status: true };
};
exports.validateCampaignCreate = validateCampaignCreate;
const validateCampaignEdit = (data) => {
    return { status: true };
};
exports.validateCampaignEdit = validateCampaignEdit;
