import { getUser } from "../user/service.js";
import NotFoundError from "../utils/errors/NotFoundError.js";

export const validateEditability = async ({
  targetUserId,
  userId,
}: {
  targetUserId: string;
  userId: string;
}) => {
  const targetUser = await getUser({ id: targetUserId });
  if (!targetUser) {
    throw new NotFoundError("User not found");
  }
};
