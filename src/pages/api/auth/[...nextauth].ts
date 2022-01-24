import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { getActiveUserSubscription, insertUser } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async session({ session }) {
      let userActiveSubscription = null;

      try {
        userActiveSubscription = await getActiveUserSubscription(
          session.user.email
        );
      } catch (err) {}
      return {
        ...session,
        activeSubscription: userActiveSubscription,
      };
    },
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
