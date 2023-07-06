import { GradeYear, PermissionType, Prisma, UserRole } from "@prisma/client";
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
  const editingUser = await dbClient.user.findUnique({
    where: { id: userId },
    include: {
      permissions: {
        include: {
          organization: {
            include: {
              schools: {
                select: {
                  id: true,
                },
              },
              rooms: {
                select: {
                  id: true,
                },
              },
            },
          },
          school: {
            include: {
              rooms: {
                select: {
                  id: true,
                },
              },
            },
          },
          room: true,
        },
      },
    },
  });
  if (!editingUser) {
    throw new NotFoundError("User not found");
  }
  // If room, can the user edit it? - Or its parent school or school's org?
  // If no room but school, can the user edit it? - Or its parent org?
  // If no school or room but organization, can the user edit it?
  const explicitRoomPermission = editingUser.permissions?.find(
    (permission) =>
      permission.roomId === roomId &&
      permission.type === PermissionType.ROOM_ADMIN
  );
  const explicitSchoolPermission = editingUser.permissions?.find(
    (permission) =>
      permission.schoolId === schoolId &&
      permission.type === PermissionType.SCHOOL_ADMIN
  );
  const explicitOrganizationPermission = editingUser.permissions?.find(
    (permission) =>
      permission.organizationId === organizationId &&
      permission.type === PermissionType.ORG_ADMIN
  );

  let implicitSchoolPermission: boolean = false;
  let implicitRoomPermission: boolean = false;
  if (!explicitSchoolPermission) {
    // Find org admin permission for this schoolId's org
    const result = editingUser?.permissions?.filter((perm) =>
      perm.type === PermissionType.ORG_ADMIN
        ? perm.organization?.schools?.find((school) => school.id === schoolId)
        : false
    );
    if (result?.length) {
      implicitSchoolPermission = true;
    }
  }

  if (!explicitRoomPermission) {
    // Find school admin permission for this room's school
    let isImplicitRoomAdmin = false;
    const schoolAdmin = editingUser?.permissions?.filter((perm) =>
      perm.type === PermissionType.SCHOOL_ADMIN
        ? perm?.school?.rooms?.find((room) => room.id === roomId)
        : false
    );
    if (schoolAdmin?.length) {
      isImplicitRoomAdmin = true;
    }
    if (!isImplicitRoomAdmin) {
      // Find org admin permission for this room's org
      const orgAdmin = editingUser?.permissions?.filter((perm) =>
        perm.type === PermissionType.ORG_ADMIN
          ? perm.organization?.rooms?.find((room) => room.id === roomId)
          : false
      );

      isImplicitRoomAdmin = !!orgAdmin?.length;
    }

    if (isImplicitRoomAdmin) {
      implicitSchoolPermission = true;
    }
  }
  if (roomId && !explicitRoomPermission && !implicitRoomPermission) {
    throw new UnauthorizedError("User cannot edit this room");
  }
  if (
    !roomId &&
    schoolId &&
    !explicitSchoolPermission &&
    !implicitSchoolPermission
  ) {
    throw new UnauthorizedError("User cannot edit this school");
  }
  if (
    !roomId &&
    !schoolId &&
    organizationId &&
    !explicitOrganizationPermission
  ) {
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
