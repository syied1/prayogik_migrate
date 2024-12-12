import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { db } from "../../../../lib/db";
import { z } from "zod";

export const authOptions = {
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  callbacks: {
    async signIn({ account, profile }) {
      try {
        if (profile) {
          const name = profile?.name ?? null;
          const email = profile?.email ?? null;
          const formData = {
            name,
            email,
            emailVerified: true,
          };

          // Check if an email is available for sign-in
          if (!email) {
            throw new Error("Email is required for sign-in.");
          }

          const userFound = await db.user.findUnique({
            where: { email: email },
          });

          // If the user already exists, return the existing user
          if (userFound) {
            if (!userFound.emailVerified) {
              throw new Error("Email is not verified.");
            }
            return true; // Authentication successful
          }

          // Create a new user
          const newUser = await db.user.create({
            data: formData,
          });

          // Return the newly created user
          return newUser;
        }
        // Retrieve user's name and email from the authentication provider's profile
      } catch (error) {
        // Handle any errors that occur during the sign-in process
        console.error("An error occurred:", error);
        throw new Error(error.message || "Authentication failed.");
        // You can choose to return an error response or perform other error handling here
      }

      // Return true to indicate successful sign-in
      return true;
    },

    async session({ session, token, user }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },

    // async jwt({ token, user, account }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.role = user.role;
    //   } else {
    //     const userFound = await db.user.findUnique({
    //       where: { email: token.email },
    //     });
    //     token.id = userFound.id;
    //     token.role = userFound.role;
    //   }

    //   return token;
    // },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Set user ID in the token
        token.role = user.role; // Set user role in the token
      } else {
        const userFound = await db.user.findUnique({
          where: { email: token.email },
        });
        if (userFound) {
          token.id = userFound.id;
          token.role = userFound.role;
        }
      }
      return token;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          image: profile.picture,
          emailVerified: true,
        };
      },
    }),
    CredentialsProvider({
      name: "Sign in with email and password.",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@mail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter password",
        },
      },
      authorize: async (credentials, req) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await db.user.findUnique({
            where: { email: email },
          });

          if (!user) {
            throw new Error("User doesn't exist!");
          }

          if (!user.emailVerified) {
            throw new Error("Email is not verified.");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            user.password = null;
            return user;
          } else {
            throw new Error("Invalid email or password.");
          }
        } else {
          throw new Error("Invalid credentials.");
        }

        // return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  debug: true,
};
