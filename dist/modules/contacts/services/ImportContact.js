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
const contact_1 = require("../validations/contact");
const validateCSV_1 = require("../validations/validateCSV");
const handleSaveContacts = async (contact, listId, userId) => (await prisma_1.prisma.contact.create({ data: Object.assign(Object.assign({}, contact), { segmentId: listId, userId }) }));
const handleSaveSegment = async (list, userId) => (await prisma_1.prisma.segment.create({ data: { title: list, userId } }));
const handleSegmentCheck = async (list) => (await prisma_1.prisma.segment.findUnique({
    where: { title: list }
}));
const handleContactsAlredyExists = async (contacts, userId) => {
    const contactsAlredyRegistered = [];
    const registerContacts = contacts.map(async (contact) => {
        const checkIsValidContact = (0, contact_1.validateContact)(contact);
        const contactFounds = await prisma_1.prisma.contact.findUnique({
            where: { email: contact.email }
        });
        if (contactFounds) {
            return contactsAlredyRegistered.push(contactFounds);
        }
        const segmentExists = await handleSegmentCheck(String(contact.segmentId).length <= 0 ? 'Default' : String(contact.segmentId));
        if (!segmentExists) {
            const segmentSave = await handleSaveSegment(String(contact.segmentId), userId);
            if (checkIsValidContact.status) {
                return await handleSaveContacts(contact, Number(segmentSave.id), userId);
            }
        }
        if (checkIsValidContact.status) {
            return await handleSaveContacts(contact, Number(segmentExists === null || segmentExists === void 0 ? void 0 : segmentExists.id), userId);
        }
        return checkIsValidContact;
    });
    return {
        registerContactsResponse: await Promise.all(registerContacts),
        contactsExists: contactsAlredyRegistered
    };
};
class ImportContact {
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
            const contactsLine = readline_1.default.createInterface({
                input: readableFile
            });
            let contactsArr = [], formatContactsArr = [];
            try {
                for (var contactsLine_1 = __asyncValues(contactsLine), contactsLine_1_1; contactsLine_1_1 = await contactsLine_1.next(), !contactsLine_1_1.done;) {
                    let line = contactsLine_1_1.value;
                    const contactsLineSplit = line.split(',');
                    contactsArr.push({
                        name: contactsLineSplit[0],
                        email: contactsLineSplit[1],
                        phone: contactsLineSplit[2],
                        business: contactsLineSplit[3],
                        segmentId: String(contactsLineSplit[4])
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (contactsLine_1_1 && !contactsLine_1_1.done && (_a = contactsLine_1.return)) await _a.call(contactsLine_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            formatContactsArr = contactsArr.slice(1, contactsArr.length);
            const { contactsExists, registerContactsResponse } = await handleContactsAlredyExists(formatContactsArr, userId.id);
            const compareIfContactsExists = contactsExists.length >= registerContactsResponse.length;
            const getContactsBodyOnResponse = registerContactsResponse
                .filter(contact => typeof contact === 'object');
            return { data: compareIfContactsExists ? true : getContactsBodyOnResponse };
        }
        if (isValidFile.ok && typeModel === 'send-email') {
            const readableFile = new stream_1.Readable();
            readableFile.push(file === null || file === void 0 ? void 0 : file.buffer);
            readableFile.push(null);
            const contactsLine = readline_1.default.createInterface({
                input: readableFile
            });
            let contactsArr = [], formatContactsArr = [];
            try {
                for (var contactsLine_2 = __asyncValues(contactsLine), contactsLine_2_1; contactsLine_2_1 = await contactsLine_2.next(), !contactsLine_2_1.done;) {
                    let line = contactsLine_2_1.value;
                    const contactsLineSplit = line.split(',');
                    contactsArr.push({
                        email: contactsLineSplit[0],
                        segmentId: String(contactsLineSplit[1])
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (contactsLine_2_1 && !contactsLine_2_1.done && (_b = contactsLine_2.return)) await _b.call(contactsLine_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            formatContactsArr = contactsArr.slice(1, contactsArr.length);
            const { contactsExists, registerContactsResponse } = await handleContactsAlredyExists(formatContactsArr, userId.id);
            const compareIfContactsExists = contactsExists.length >= registerContactsResponse.length;
            const getContactsBodyOnResponse = registerContactsResponse
                .filter(contact => typeof contact === 'object');
            return { data: compareIfContactsExists ? true : getContactsBodyOnResponse };
        }
    }
}
exports.default = new ImportContact();
