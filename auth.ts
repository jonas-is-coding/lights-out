import NextAuth from "next-auth";
import NeonAdapter from "@auth/neon-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { pool } from "@/db";

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  const providers = [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email as string | undefined;
          const password = credentials?.password as string | undefined;

          if (!email || !password) return null;

          const result = await pool.query(
            "SELECT id, name, email, password FROM users WHERE email = $1",
            [email]
          );

          const user = result.rows[0];
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) return null;

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
          };
        } catch {
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ];

  return {
    secret: process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET,
    adapter: NeonAdapter(pool),
    session: { strategy: "jwt" as const },
    providers,
    pages: {
      signIn: "/login",
    },
    callbacks: {
      jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
        }
        return session;
      },
    },
  };
});
