import { prisma } from '@/lib/prisma';
import { DEMO_USER_EMAIL } from '@/lib/constants';
import { runWithFallback } from '@/server/db-fallback';
import { getDemoUserRecord } from '@/server/demo-store';

export const authRepository = {
  async getDemoUser() {
    return runWithFallback(
      () =>
        prisma.user.findUnique({
          where: { email: DEMO_USER_EMAIL },
          select: {
            id: true,
            email: true,
            name: true,
          },
        }),
      () => {
        const user = getDemoUserRecord();

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    );
  },
};
