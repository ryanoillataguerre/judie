import dbClient from "../utils/prisma.js";

export const getMessageById = async (id: string) => {
  return await dbClient.message.findUnique({
    where: {
      id,
    },
  });
};
