"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const readline_1 = __importDefault(require("readline"));
const prisma_1 = require("config/prisma");
const lead_1 = require("../validations/lead");
const validateCSV_1 = require("../validations/validateCSV");
const handleSaveLeads = async (lead, listId, userId) => (await prisma_1.prisma.lead.create({ data: Object.assign(Object.assign({}, lead), { segmentId: listId, userId }) }));
const handleSaveSegment = async (list, userId) => (await prisma_1.prisma.segment.create({ data: { title: list, userId } }));
const handleSegmentCheck = async (list) => (await prisma_1.prisma.segment.findUnique({
    where: { title: list }
}));
const handleLeadsAlredyExists = async (leads, userId) => {
    const leadsAlredyRegistered = [];
    const registerLeads = leads.map(async (lead) => {
        const checkIsValidLead = (0, lead_1.validateLead)(lead);
        const leadFounds = await prisma_1.prisma.lead.findUnique({
            where: { email: lead.email }
        });
        if (leadFounds) {
            return leadsAlredyRegistered.push(leadFounds);
        }
        const segmentExists = await handleSegmentCheck(String(lead.segmentId).length <= 0 ? 'Default' : String(lead.segmentId));
        if (!segmentExists) {
            const segmentSave = await handleSaveSegment(String(lead.segmentId), userId);
            if (checkIsValidLead.status) {
                return await handleSaveLeads(lead, Number(segmentSave.id), userId);
            }
        }
        if (checkIsValidLead.status) {
            return await handleSaveLeads(lead, Number(segmentExists === null || segmentExists === void 0 ? void 0 : segmentExists.id), userId);
        }
        return checkIsValidLead;
    });
    return {
        registerLeadsResponse: await Promise.all(registerLeads),
        leadsExists: leadsAlredyRegistered
    };
};
class ImportLead {
    async execute({ file, userId, typeModel }) {
        var e_1, _a, e_2, _b;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId.id }
        });
        if (!user)
            throw new Error("User not found");
        if (!(user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.status) === 'DISABLED')
            throw new Error("User without permission");
        const isValidFile = (0, validateCSV_1.validationCsvFile)(file);
        if (isValidFile.ok && typeModel === 'cold-emails') {
            const readableFile = new stream_1.Readable();
            readableFile.push(file === null || file === void 0 ? void 0 : file.buffer);
            readableFile.push(null);
            const leadsLine = readline_1.default.createInterface({
                input: readableFile
            });
            let leadsArr = [], formatLeadsArr = [];
            try {
                for (var leadsLine_1 = __asyncValues(leadsLine), leadsLine_1_1; leadsLine_1_1 = await leadsLine_1.next(), !leadsLine_1_1.done;) {
                    let line = leadsLine_1_1.value;
                    const leadsLineSplit = line.split(',');
                    leadsArr.push({
                        name: leadsLineSplit[0],
                        email: leadsLineSplit[1],
                        phone: leadsLineSplit[2],
                        business: leadsLineSplit[3],
                        segmentId: String(leadsLineSplit[4])
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (leadsLine_1_1 && !leadsLine_1_1.done && (_a = leadsLine_1.return)) await _a.call(leadsLine_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            formatLeadsArr = leadsArr.slice(1, leadsArr.length);
            const { leadsExists, registerLeadsResponse } = await handleLeadsAlredyExists(formatLeadsArr, userId.id);
            const compareIfLeadsExists = leadsExists.length >= registerLeadsResponse.length;
            const getLeadsBodyOnResponse = registerLeadsResponse
                .filter(lead => typeof lead === 'object');
            return { data: compareIfLeadsExists ? true : getLeadsBodyOnResponse };
        }
        if (isValidFile.ok && typeModel === 'send-email') {
            const readableFile = new stream_1.Readable();
            readableFile.push(file === null || file === void 0 ? void 0 : file.buffer);
            readableFile.push(null);
            const leadsLine = readline_1.default.createInterface({
                input: readableFile
            });
            let leadsArr = [], formatLeadsArr = [];
            try {
                for (var leadsLine_2 = __asyncValues(leadsLine), leadsLine_2_1; leadsLine_2_1 = await leadsLine_2.next(), !leadsLine_2_1.done;) {
                    let line = leadsLine_2_1.value;
                    const leadsLineSplit = line.split(',');
                    leadsArr.push({
                        email: leadsLineSplit[0],
                        segmentId: String(leadsLineSplit[1])
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (leadsLine_2_1 && !leadsLine_2_1.done && (_b = leadsLine_2.return)) await _b.call(leadsLine_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            formatLeadsArr = leadsArr.slice(1, leadsArr.length);
            const { leadsExists, registerLeadsResponse } = await handleLeadsAlredyExists(formatLeadsArr, userId.id);
            const compareIfLeadsExists = leadsExists.length >= registerLeadsResponse.length;
            const getLeadsBodyOnResponse = registerLeadsResponse
                .filter(lead => typeof lead === 'object');
            return { data: compareIfLeadsExists ? true : getLeadsBodyOnResponse };
        }
    }
}
exports.default = new ImportLead();
