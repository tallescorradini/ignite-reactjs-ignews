import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";

import { stripe } from "../../services/stripe";
import {
  saveSubscription,
  updateSubscription,
} from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      const reqBuffer = await buffer(req);
      const secret = req.headers["stripe-signature"];

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          reqBuffer,
          secret,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}`);
      }

      const { type } = event;

      if (relevantEvents.has(type)) {
        try {
          switch (type) {
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
              const subscription = event.data.object as Stripe.Subscription;
              await updateSubscription(
                subscription.id,
                subscription.customer.toString()
              );
              break;
            }
            case "customer.subscription.created":
            case "checkout.session.completed": {
              const checkoutSession = event.data
                .object as Stripe.Checkout.Session;
              await saveSubscription(
                checkoutSession.subscription.toString(),
                checkoutSession.customer.toString()
              );
              break;
            }

            default:
              throw new Error("Unhandled event");
          }
        } catch (err) {
          return res.json({ error: "Webhook handler failed" });
        }
      }

      return res.json({ received: true });
    }

    default:
      res.setHeader("Allow", "POST");
      res.status(405).end("Method not allowed");
  }
}
