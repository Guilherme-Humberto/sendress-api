"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchedule = void 0;
const validateSchedule = (data, userId) => {
    const isEmpty = !userId || !data.segmentId;
    if (isEmpty) {
        return {
            status: false,
            message: 'user, segment and dates is required'
        };
    }
    return { status: true };
};
exports.validateSchedule = validateSchedule;
