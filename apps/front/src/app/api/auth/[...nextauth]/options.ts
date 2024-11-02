import { Account, AuthOptions, ISODateString, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import axios, { AxiosError } from "axios";
import { LOGIN_URL } from "@/lib/apiAuthRoutes";
import { redirect } from "next/navigation";

export interface CustomSession {
  user?: CustomUser;
  expires: ISODateString;
}
export interface CustomUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string | null;
  token?: string | null;
}
export const authOptions: AuthOptions = {
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: CustomUser;
      account: Account | null;
    }) {
      try {
        console.log("User in signIn:", user);
        const payload = {
          email: user.email!,
          name: user.name!,
          oauth_id: account?.providerAccountId!,
          provider: account?.provider!,
          image: user?.image,
        };
        console.log("Payload in signIn:", payload);
        const { data } = await axios.post(LOGIN_URL, payload);
        console.log("Data from signIn:", data);

        user.id = data?.user?.id?.toString();
        user.token = data?.user?.token;
        return true;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Axios error during signIn:", error.message);
          return redirect(`/auth/error?message=${error.message}`);
        }
        console.error("Unknown error during signIn:", error);
        return redirect(
          `/auth/error?message=Something went wrong.please try again!`
        );
      }
    },

    async jwt({ token, user }) {
      try {
        if (user) {
          token.user = user;
        }
        return token;
      } catch (error) {
        console.error("Error in jwt callback:", error);
        throw error;
      }
    },

    async session({
      session,
      token,
      user,
    }: {
      session: CustomSession;
      token: JWT;
      user: User;
    }) {
      try {
        session.user = token.user as CustomUser;
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        throw error;
      }
    },
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
};