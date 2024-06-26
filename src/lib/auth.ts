import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import { authSchema } from "./validations";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login

        // validation
        const validatedFormData = authSchema.safeParse(credentials);

        if (!validatedFormData.success) {
          return null;
        }
        const { email, password } = validatedFormData.data;
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          console.log("User not found");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (!passwordsMatch) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ request, auth }) => {
      // runs on every request with middleware
      const isTryingToAcessApp = request.nextUrl.pathname.includes("/app");
      const isLoggedIn = Boolean(auth?.user);
      if (!isLoggedIn && isTryingToAcessApp) {
        return false;
      }
      if (isLoggedIn && isTryingToAcessApp && auth?.user.hasAccess) {
        return true;
      }

      if (
        isLoggedIn &&
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")) &&
        auth?.user.hasAccess
      ) {
        return Response.redirect(
          new URL("/app/dashboard", request.nextUrl)
        );
      }

      if (isLoggedIn && !isTryingToAcessApp) {
        if (
          (request.nextUrl.pathname.includes("/login") ||
            request.nextUrl.pathname.includes("/signup")) &&
          !auth?.user.hasAccess
        ) {
          return Response.redirect(new URL("/payment", request.nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && !isTryingToAcessApp) {
        return true;
      }
      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        // on sign in
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      if (trigger === "update") {
        // on every request
        const userFromDb = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess;
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },
  // session: {
  //   maxAge: 30 * 24 * 60 * 60,
  //   strategy: "jwt",
  // },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
