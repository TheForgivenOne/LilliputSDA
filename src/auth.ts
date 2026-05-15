import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"
import { authLimiter, checkRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Rate limiting to prevent brute-force attacks
        const headerList = await headers();
        const ip = headerList.get("x-forwarded-for")?.split(",")[0].trim() ||
                   headerList.get("x-real-ip") ||
                   "anonymous";

        const { success } = await checkRateLimit(authLimiter, `login:${ip}`);
        if (!success) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        const email = String(credentials.email)
        const password = String(credentials.password)

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          await compare(password, "$2b$12$j/CB/cmVuE6iXSig5zRkIu.DK3JwL4X4xvKlv0ifTgEO6tUSSvxF6")
          return null
        }

        const isValid = await compare(password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = typeof token.role === "string" ? token.role : "user";
        session.user.id = typeof token.id === "string" ? token.id : "";
      }
      return session;
    },
  },
})