import dbClient from "../../src/utils/prisma.js";
import seedUsers from "./users.js";

const seed = async () => {
  await seedUsers(dbClient);
  // Subscriptions
  // Chats
  // Messages

  // Organizations
  // Schools
  // Rooms
  // Permissions
};
seed()
  .then(async () => {
    await dbClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await dbClient.$disconnect();
    // @ts-ignore
    process.exit(1);
  });
