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
  if (organizationId) {
    const organization = await dbClient.organization.update({
      where: {
        ...(organizationId ? { id: organizationId } : {}),
      },
      data: {
        count,
      },
    });
    return organization;
  }
  if (schoolId) {
    const school = await dbClient.school.update({
      where: {
        ...(schoolId ? { id: schoolId } : {}),
      },
      data: {
        count,
      },
    });
    return school;
  }
};
