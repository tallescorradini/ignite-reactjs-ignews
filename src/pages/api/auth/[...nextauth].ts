import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { insertUser } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user;
      try {
        await insertUser(email);
        return true;
      } catch (e) {
        return true;
      }
    },
  },
});
