import { PrismaAdapter } from '@auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        (session.user as any).id        = user.id
        ;(session.user as any).isVerified = (user as any).isVerified
        ;(session.user as any).isAdmin    = (user as any).isAdmin
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
}
