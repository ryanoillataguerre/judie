import { GradeYear, PermissionType, Prisma, UserRole } from "@prisma/client";
import { getUser } from "../users/service.js";
import NotFoundError from "../utils/errors/NotFoundError.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import dbClient from "../utils/prisma.js";
import { signup } from "../auth/service.js";
import { subscribeUser } from "../admin/service.js";

export const validateInviteRights = async ({
  userId,
  organizationId,
  schoolId,
  roomId,
}: {
  userId: string;
  organizationId?: string;
  schoolId?: string;
  roomId?: string;
}) => {
  const editingUser = await getUser(
    { id: userId },
    {
      permissions: true,
    }
  );
  if (!editingUser) {
    throw new NotFoundError("User not found");
  }
  // If room, can the user edit it?
  // If no room but school, can the user edit it?
  // If no school or room but organization, can the user edit it?
  const roomPermission = editingUser.permissions?.find(
    (permission) =>
      permission.organizationId === organizationId &&
      permission.schoolId === schoolId &&
      permission.roomId === roomId &&
      permission.type === PermissionType.ROOM_ADMIN
  );
  const schoolPermission = editingUser.permissions?.find(
    (permission) =>
      permission.organizationId === organizationId &&
      permission.schoolId === schoolId &&
      permission.type === PermissionType.SCHOOL_ADMIN
  );
  const organizationPermission = editingUser.permissions?.find(
    (permission) =>
      permission.organizationId === organizationId &&
      permission.type === PermissionType.ORG_ADMIN
  );
  if (roomId && !roomPermission) {
    throw new UnauthorizedError("User cannot edit this room");
  }
  if (!roomId && schoolId && !schoolPermission) {
    throw new UnauthorizedError("User cannot edit this school");
  }
  if (!roomId && !schoolId && organizationId && !organizationPermission) {
    throw new UnauthorizedError("User cannot edit this organization");
  }
  return true;
};

export const createInvite = async (params: Prisma.InviteCreateInput) => {
  return await dbClient.invite.create({
    data: params,
  });
};

export const getInvite = async (params: Prisma.InviteFindUniqueArgs) => {
  return await dbClient.invite.findUnique(params);
};

interface RedeemInviteParams {
  inviteId: string;
  firstName: string;
  lastName: string;
  password: string;
  receivePromotions: boolean;
  role?: string;
}
export const redeemInvite = async (params: RedeemInviteParams) => {
  const invite = await dbClient.invite.findUnique({
    where: {
      id: params.inviteId,
    },
    include: {
      permissions: true,
    },
  });
  if (!invite) {
    throw new UnauthorizedError("Invite not found - it may have expired.");
  }

  // Create user
  const newUser = await signup({
    firstName: params.firstName,
    lastName: params.lastName,
    email: invite.email,
    password: params.password,
    gradeYear: invite.gradeYear as GradeYear | undefined,
    receivePromotions: params.receivePromotions,
    role: (params.role as UserRole) || UserRole.STUDENT,
  });

  // Set userId on all permissions from invite
  const updatePermissionsPromises = [];
  for (const permission of invite.permissions) {
    updatePermissionsPromises.push(
      dbClient.userPermission.update({
        where: {
          id: permission.id,
        },
        data: {
          userId: newUser.id,
        },
      })
    );
  }
  await Promise.all(updatePermissionsPromises);

  // Relate organization, school, and room to user if they're present
  if (invite.organizationId) {
    await dbClient.organization.update({
      where: {
        id: invite.organizationId,
      },
      data: {
        users: {
          connect: {
            id: newUser.id,
          },
        },
      },
    });
  }
  if (invite.schoolId) {
    await dbClient.school.update({
      where: {
        id: invite.schoolId,
      },
      data: {
        users: {
          connect: {
            id: newUser.id,
          },
        },
      },
    });
  }
  if (invite.roomId) {
    await dbClient.room.update({
      where: {
        id: invite.roomId,
      },
      data: {
        users: {
          connect: {
            id: newUser.id,
          },
        },
      },
    });
  }

  // Add subscription for user
  await subscribeUser({
    userId: newUser.id,
    organizationId: invite.organizationId as string,
  });

  // Delete invite
  await dbClient.invite.delete({
    where: {
      id: invite.id,
    },
  });

  return newUser;
};
