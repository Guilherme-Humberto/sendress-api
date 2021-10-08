"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe_2 = __importDefault(require("@config/stripe"));
const stripe = () => (new stripe_1.default(stripe_2.default.secret_key, { apiVersion: '2020-08-27' }));
exports.stripe = stripe;
