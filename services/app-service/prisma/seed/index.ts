import dbClient from "../../src/utils/prisma";
import seedUsers from "./users";

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

seed().catch((e) => {
  console.error(e);
  // @ts-ignore
  process.exit(1);
});
