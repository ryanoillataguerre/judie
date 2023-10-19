import { PrismaClient } from "@prisma/client";

const dbClient = new PrismaClient({
  log: [
    "query",
    // {
    //   emit: "event",
    //   level: "query",
    // },
    // {
    //   emit: "stdout",
    //   level: "error",
    // },
    // {
    //   emit: "stdout",
    //   level: "info",
    // },
    // {
    //   emit: "stdout",
    //   level: "warn",
    // },
  ],
});
// dbClient.$on("query", async (e) => {
//   console.log(`${e.query} ${e.params}`);
// });

export default dbClient;
