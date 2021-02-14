import express, { NextFunction, Request, Response } from 'express';
export const app = express();

app.use(express.json());

import cors from 'cors';
app.use(cors({ origin: true }));

// Sets rawBody for webhook handling
app.use(express.json({ verify: (req, res, buffer) => (req['rawBody'] = buffer) }));

app.post('/test', (req: Request, res: Response) => {
  const amount = req.body.amount;

  res.status(200).send({ with_tax: amount * 7 });
});

import { createStripeCheckoutSession } from './checkout';

/**
 * Checkouts
 */
app.post(
  '/checkouts',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripeCheckoutSession(body.line_items));
  })
);

import { createPaymentIntent } from './payments';

/**
 * Payment Intents API
 */

// Create a PaymentIntent
app.post(
  '/payments',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createPaymentIntent(body.amount));
  })
);

import { handleStripeWebhook } from './webhooks';

/**
 * Webhooks
 */

// Handle webhooks
app.post('/hooks', runAsync(handleStripeWebhook));

/**
 * Catch async errors when awaiting promises
 */
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}
