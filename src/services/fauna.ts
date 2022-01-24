import { Client, query as q } from "faunadb";

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY,
  domain: "db.us.fauna.com",
});

type UserFauna = {
  ref: {
    id: string;
  };
  data: {
    email: string;
    stripe_customer_id: string;
  };
};

export async function insertUser(email: string) {
  await fauna.query(
    q.If(
      q.Not(q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))),
      q.Create(q.Collection("users"), { data: { email } }),
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
    )
  );
}

export async function updateUserStripeId(
  userId: string,
  stripeCustomerId: string
) {
  await fauna.query(
    q.Update(q.Ref(q.Collection("users"), userId), {
      data: {
        stripe_customer_id: stripeCustomerId,
      },
    })
  );
}

export async function getUserByEmail(email: string) {
  const user = await fauna.query<UserFauna>(
    q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
  );
  return {
    id: user.ref.id,
    email: user.data.email,
    customerId: user.data.stripe_customer_id,
  };
}

export async function getActiveUserSubscription(email: string) {
  return await fauna.query(
    q.Get(
      q.Intersection([
        q.Match(
          q.Index("subscription_by_user_ref"),
          q.Select(
            "ref",
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
          )
        ),
        q.Match(q.Index("subscription_by_status"), "active"),
      ])
    )
  );
}
