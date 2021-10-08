"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveSession = void 0;
const configure_1 = require("./configure");
const retrieveSession = async (transactionId) => {
    const stripeSession = (0, configure_1.stripe)();
    return await stripeSession.checkout.sessions.retrieve(transactionId);
};
exports.retrieveSession = retrieveSession;
