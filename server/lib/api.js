"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = express_1.default();
exports.app.use(express_1.default.json());
const cors_1 = __importDefault(require("cors"));
exports.app.use(cors_1.default({ origin: true }));
// Sets rawBody for webhook handling
exports.app.use(express_1.default.json({ verify: (req, res, buffer) => (req['rawBody'] = buffer) }));
exports.app.post('/test', (req, res) => {
    const amount = req.body.amount;
    res.status(200).send({ with_tax: amount * 7 });
});
const checkout_1 = require("./checkout");
/**
 * Checkouts
 */
exports.app.post('/checkouts', runAsync(async ({ body }, res) => {
    res.send(await checkout_1.createStripeCheckoutSession(body.line_items));
}));
const payments_1 = require("./payments");
/**
 * Payment Intents API
 */
// Create a PaymentIntent
exports.app.post('/payments', runAsync(async ({ body }, res) => {
    res.send(await payments_1.createPaymentIntent(body.amount));
}));
const webhooks_1 = require("./webhooks");
/**
 * Webhooks
 */
// Handle webhooks
exports.app.post('/hooks', runAsync(webhooks_1.handleStripeWebhook));
const firebase_1 = require("./firebase");
// Decodes the Firebase JSON Web Token
exports.app.use(decodeJWT);
/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body
 */
async function decodeJWT(req, res, next) {
    var _a, _b;
    if ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        try {
            const decodedToken = await firebase_1.auth.verifyIdToken(idToken);
            req['currentUser'] = decodedToken;
        }
        catch (err) {
            console.log(err);
        }
    }
    next();
}
/**
 * Catch async errors when awaiting promises
 */
function runAsync(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}
//# sourceMappingURL=api.js.map