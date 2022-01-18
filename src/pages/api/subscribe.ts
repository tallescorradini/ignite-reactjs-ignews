import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getUserByEmail, updateUserStripeId } from "../../services/fauna";

import { stripe } from "../../services/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getSession({ req });

    const user = await getUserByEmail(session.user.email);

    let customerId = user.customerId;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      });
      await updateUserStripeId(user.id, stripeCustomer.id);
      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1KF4LYEKHf9HSzDLhjJ1rQjh", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST").status(405).end("Method not allowed");
  }
}
