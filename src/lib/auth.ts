import type { NextAuthOptions, DefaultSession, User as NextAuthUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const email = credentials.email.toLowerCase().trim();

        const organization = await prisma.organization.findUnique({
          where: { email },
        });

        if (!organization || !organization.passwordHash) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          organization.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: organization.id,
          email: organization.email,
          name: organization.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) || (token.sub as string);
      }
      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
export const getAuthSession = () => getServerSession(authOptions);
export const auth = () => getServerSession(authOptions);
