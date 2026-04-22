import { prisma } from '@/lib/prisma';
import { DEMO_USER_EMAIL } from '@/lib/constants';

export const authRepository = {
  async getDemoUser() {
    return prisma.user.findUnique({
      where: { email: DEMO_USER_EMAIL },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  },
};
