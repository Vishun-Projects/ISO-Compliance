import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          // Log successful login
          await prisma.auditLog.create({
            data: {
              action: 'LOGIN',
              entityType: 'USER',
              entityId: user.id,
              userId: user.id,
              details: JSON.stringify({ email: user.email, ipAddress: 'unknown' }),
              ipAddress: 'unknown',
              userAgent: 'unknown',
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.department = token.department as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

// RBAC permissions
export const permissions = {
  DOCUMENT_VIEW: ['admin', 'manager', 'employee', 'auditor'],
  DOCUMENT_CREATE: ['admin', 'manager'],
  DOCUMENT_EDIT: ['admin', 'manager'],
  DOCUMENT_DELETE: ['admin'],
  DOCUMENT_APPROVE: ['admin', 'manager'],
  AUDIT_VIEW: ['admin', 'auditor'],
  USER_MANAGE: ['admin'],
  COMPLIANCE_VIEW: ['admin', 'manager', 'auditor'],
  COMPLIANCE_EDIT: ['admin', 'manager'],
};

export function hasPermission(userRole: string, permission: string): boolean {
  const allowedRoles = permissions[permission as keyof typeof permissions];
  return allowedRoles ? allowedRoles.includes(userRole) : false;
}
