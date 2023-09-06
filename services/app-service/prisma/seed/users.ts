import { PrismaClient } from "@prisma/client";

const users = [
  {
    email: "test@test.com",
    emailVerified: true,
    receivePromotions: true,
    firstName: "Test",
    lastName: "User",
    password: "test",
  },
  {
    email: "test2@test.com",
    emailVerified: false,
    receivePromotions: false,
    firstName: "Testtwo",
    lastName: "User",
    password: "test",
  },
];

const seed = async (prismaClient: PrismaClient) => {
  return await Promise.all(
    users.map((user) =>
      prismaClient.user.create({
        data: user,
      })
    )
  );
};

export default seed;
