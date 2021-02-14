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

import { auth } from './firebase';

// Decodes the Firebase JSON Web Token
app.use(decodeJWT);

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body
 */
async function decodeJWT(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}

/**
 * Catch async errors when awaiting promises
 */
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}
