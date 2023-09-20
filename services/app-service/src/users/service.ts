import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";
import { sendParentalConsentEmail } from "../cio/service.js";

export const getUser = async (
  params: Prisma.UserWhereInput,
  includeParams?: Prisma.UserInclude
) => {
  return await dbClient.user.findFirst({
    where: params,
    include: includeParams || {
      subscription: true,
      chats: {
        include: {
          messages: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
};

export const updateUser = async (
  userId: string,
  data: Prisma.UserUpdateInput
) => {
  return await dbClient.user.update({
    where: {
      id: userId,
    },
    data,
  });
};

export const incrementUserQuestionsAsked = async (userId: string) => {
  return await dbClient.user.update({
    where: {
      id: userId,
    },
    data: {
      questionsAsked: {
        increment: 1,
      },
    },
  });
};

export const getUserPermissions = async (
  params: Prisma.UserWhereUniqueInput
) => {
  const user = await dbClient.user.findUnique({
    where: params,
    include: {
      permissions: true,
      rooms: true,
    },
  });
  return user?.permissions;
};

export const getUserPermissionsRoomsSchools = async (
  params: Prisma.UserWhereUniqueInput
) => {
  const user = await dbClient.user.findUnique({
    where: params,
    include: {
      permissions: {
        include: {
          room: true,
          school: true,
          organization: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return user?.permissions;
};

export const verifyUserEmail = async (userId: string) => {
  return await dbClient.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: true,
    },
  });
};

export const userAgeConsent = async ({
  userId,
  dateOfBirth,
  parentEmail,
}: {
  userId: string;
  dateOfBirth: Date;
  parentEmail?: string;
}) => {
  const birthdayDate = new Date(dateOfBirth);
  // If DOB is >13 years ago, then ignore parent email but still update
  const thirteenYearsAgo = new Date();
  thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);
  const isOverThirteen = dateOfBirth < thirteenYearsAgo;

  const newUser = await updateUser(userId, {
    dateOfBirth: birthdayDate,
    parentalConsent: isOverThirteen,
    parentalConsentEmail: isOverThirteen ? undefined : parentEmail,
  });
  if (isOverThirteen) {
    return newUser;
  }
  // Send parental consent email if user is under 13
  await sendParentalConsentEmail({ user: newUser });
  return newUser;
};

export const parentalConsentUser = async (userId: string) => {
  const newUser = await updateUser(userId, {
    parentalConsent: true,
  });
  return newUser;
};
