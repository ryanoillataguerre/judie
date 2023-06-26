import dbClient from "../utils/prisma.js";

export const setSeatCount = async ({
  count,
  organizationId,
  schoolId,
}: {
  count: number;
  organizationId?: string;
  schoolId?: string;
}) => {
  const organization = await dbClient.seats.create({
    data: {
      count,
      ...(organizationId ? { id: organizationId } : {}),
      ...(schoolId ? { id: schoolId } : {}),
    },
  });
  return organization;
};
