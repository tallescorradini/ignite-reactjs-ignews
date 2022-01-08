import { Client, query as q } from "faunadb";

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY,
  domain: "db.us.fauna.com",
});

interface User {
  email: string;
}

export async function insertUser({ email }: User) {
  await fauna.query(
    q.If(
      q.Not(q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))),
      q.Create(q.Collection("users"), { data: { email } }),
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
    )
  );
}
