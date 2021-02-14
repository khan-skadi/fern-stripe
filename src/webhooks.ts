import { stripe } from './';
import Stripe from 'stripe';

/**
 * Business logic for specific webhook event types
 * ie: update database, send confirmation email etc
 */
const webhookHandlers = {
  'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
    
  },
  'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) {

  }
}

/**
 * Validate the stripe webhook secret, then call the handler for the event type
 */
export const handleStripeWebhook = async (req, res) => {
  // Add webhook signature and only listen to those requests that come from stripe,
  // otherwise anyone from the internet can send requests here.
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);

  try {
    await webhookHandlers[event.type](event.data.object);
    res.send({ received: true });
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
