import { DEMO_USER_EMAIL } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import { runWithFallback } from '@/server/db-fallback';
import { createDemoUser, findDemoUserByEmail, findDemoUserById } from '@/server/demo-store';

export type AuthUserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function mapUser(user: any): AuthUserRecord {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash ?? user.password ?? '',
    isAdmin: Boolean(user.isAdmin),
    createdAt: user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt),
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt : new Date(user.updatedAt),
  };
}

export const authRepository = {
  async findById(id: string) {
    return runWithFallback(
      async () => {
        const user = await prisma.user.findUnique({
          where: { id },
        });

        return user ? mapUser(user) : null;
      },
      () => {
        const user = findDemoUserById(id);
        return user ? mapUser(user) : null;
      },
    );
  },

  async findByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    return runWithFallback(
      async () => {
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        return user ? mapUser(user) : null;
      },
      () => {
        const user = findDemoUserByEmail(normalizedEmail);
        return user ? mapUser(user) : null;
      },
    );
  },

  async create(input: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    const normalizedEmail = input.email.trim().toLowerCase();

    return runWithFallback(
      async () => {
        const user = await prisma.user.create({
          data: {
            name: input.name.trim(),
            email: normalizedEmail,
            password: input.passwordHash,
            isAdmin: false,
          },
        });

        return mapUser(user);
      },
      () =>
        mapUser(
          createDemoUser({
            name: input.name.trim(),
            email: normalizedEmail,
            passwordHash: input.passwordHash,
          }),
        ),
    );
  },

  async getDemoUser() {
    const user = await this.findByEmail(DEMO_USER_EMAIL);
    return user;
  },
};
