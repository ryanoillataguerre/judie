import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createRoom = async (params: Prisma.RoomCreateArgs) => {
  return await dbClient.room.create(params);
};
