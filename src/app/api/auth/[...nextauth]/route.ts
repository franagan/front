import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const dynamic = "force-dynamic";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-expect-error id_token is not in default session type
      session.id_token = token.id_token;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
});

export { handler as GET, handler as POST };
