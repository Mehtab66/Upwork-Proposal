import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

async function userHasPassword(userId: string) {
  const client = await clientPromise;
  const user = await client
    .db()
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  return Boolean(user?.password);
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const client = await clientPromise;
        const user = await client
          .db()
          .collection("users")
          .findOne({ email: credentials.email.toLowerCase().trim() });

        if (!user?.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password as string
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email as string,
          name: user.name as string | undefined,
          image: user.image as string | undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      if (token.id && (user || token.hasPassword === undefined)) {
        token.hasPassword = await userHasPassword(token.id as string);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.hasPassword = Boolean(token.hasPassword);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
