"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = void 0;
const _1 = require(".");
const firebase_1 = require("./firebase");
const customer_1 = require("./customer");
const firebase_admin_1 = require("firebase-admin");
/**
 * Attaches a payment method to the Stripe customer,
 * subscribes to a Stripe plan, and saves the plan to Firestore
 */
async function createSubscription(userId, plan, payment_method) {
    const customer = await customer_1.getOrCreateCustomer(userId);
    // Attach the payment method to the customer
    await _1.stripe.paymentMethods.attach(payment_method, {
        customer: customer.id
    });
    // Set it as the default payment method
    await _1.stripe.customers.update(customer.id, {
        invoice_settings: {
            default_payment_method: payment_method
        }
    });
    const subscription = await _1.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan }],
        expand: ['latest_invoice.payment_intent']
    });
    const invoice = subscription.latest_invoice;
    const payment_intent = invoice.payment_intent;
    // Update the user's status
    if (payment_intent.status === 'succeeded') {
        await firebase_1.db
            .collection('users')
            .doc(userId)
            .set({ stripeCustomerId: customer.id, activePlan: firebase_admin_1.firestore.FieldValue.arrayUnion(plan) }, { merge: true });
    }
    return subscription;
}
exports.createSubscription = createSubscription;
//# sourceMappingURL=billing.js.map