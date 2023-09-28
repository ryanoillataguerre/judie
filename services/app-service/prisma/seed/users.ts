import { PrismaClient } from "@prisma/client";

const users = [
  {
    email: "test@test.com",
    emailVerified: true,
    receivePromotions: true,
    password: "test",
  },
  {
    email: "test2@test.com",
    emailVerified: false,
    receivePromotions: false,
    password: "test",
  },
];
const seed = async (prismaClient: PrismaClient) => {
  return await Promise.all(
    users.map((user) =>
      prismaClient.user.upsert({
        where: {
          email: user.email,
        },
        update: user,
        create: user,
      })
    )
  );
};

export default seed;
