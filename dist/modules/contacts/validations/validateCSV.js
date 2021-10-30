"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationCsvFile = void 0;
const validationCsvFile = (file) => {
    if ((file === null || file === void 0 ? void 0 : file.mimetype) !== 'text/csv') {
        return { ok: false };
    }
    return { ok: true };
};
exports.validationCsvFile = validationCsvFile;
