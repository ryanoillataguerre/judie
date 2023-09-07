import { GradeYear, PermissionType, Prisma, UserRole } from "@prisma/client";
import NotFoundError from "../utils/errors/NotFoundError.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import dbClient from "../utils/prisma.js";
import { signup } from "../auth/service.js";
import { subscribeUser } from "../admin/service.js";
import { sendInviteEmail } from "../cio/service.js";
import { CreateInviteBody } from "./routes.js";
import BadRequestError from "../utils/errors/BadRequestError.js";
import moment from "moment";

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
        where: {
          deletedAt: null,
        },
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
  if (!invite || invite.deletedAt) {
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
    isB2B: true,
  });

  // Set userId on all permissions from invite
  const updatePermissionsPromises = [];
  for (const permission of invite.permissions) {
    updatePermissionsPromises.push(
      dbClient.permission.update({
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

export const invite = async (params: CreateInviteBody & { userId: string }) => {
  // Validate the admin can invite for the given permissions
  const validatePermissionsPromises = [];
  for (const permission of params.permissions) {
    validatePermissionsPromises.push(
      validateInviteRights({
        userId: params.userId as string,
        organizationId: permission.organizationId,
        schoolId: permission.schoolId,
        roomId: permission.roomId,
      })
    );
  }
  await Promise.all(validatePermissionsPromises);

  const existingUser = await dbClient.user.findUnique({
    where: {
      email: params.email,
    },
  });
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const now = new Date();
  const existingInvite = await dbClient.invite.findFirst({
    where: {
      email: params.email,
      deletedAt: null,
      createdAt: {
        gt: moment(now).subtract(2, "days").format(),
      },
    },
  });
  if (existingInvite) {
    throw new BadRequestError(
      "User already invited. Please let them know to check their email."
    );
  }
  // Create invite
  const newInvite = await createInvite({
    gradeYear: params.gradeYear as GradeYear | undefined,
    email: params.email,
    permissions: {
      create: params.permissions.map((permission) => ({
        type: permission.type as PermissionType,
        organizationId: permission.organizationId,
        schoolId: permission.schoolId,
        roomId: permission.roomId,
      })),
    },
  });
  // Send invite email
  await sendInviteEmail({
    invite: newInvite,
  });
};

interface BulkInviteRow {
  email: string;
  role: string;
  school?: string;
  classroom?: string;
}
export interface BulkInviteBody {
  organizationId: string;
  invites: BulkInviteRow[];
}

const inviteRoleToPermissionTypeMap: {
  [key: string]: PermissionType;
} = {
  Teacher: PermissionType.ROOM_ADMIN,
  Student: PermissionType.STUDENT,
  Principal: PermissionType.SCHOOL_ADMIN,
  Administrator: PermissionType.ORG_ADMIN,
};

export const bulkInvite = async (
  params: BulkInviteBody & { userId: string }
) => {
  const schoolNameToIdMap = new Map<string, string>();
  const roomNameToIdMap = new Map<string, string>();
  // Validate the admin can invite for every row
  const validatePermissionsPromises = [];
  for (const invite of params.invites) {
    validatePermissionsPromises.push(async () => {
      let schoolId = undefined;
      let roomId = undefined;
      const school = await dbClient.school.findUnique({
        where: {
          name: invite.school,
        },
      });
      if (school) {
        schoolId = school.id;
        schoolNameToIdMap.set(school.name, school.id);

        if (invite.classroom) {
          const room = await dbClient.room.findFirst({
            where: {
              name: invite.classroom,
              schoolId: school.id,
            },
          });
          if (room) {
            roomId = room.id;
            roomNameToIdMap.set(room.name, room.id);
          }
        }
      }
      await validateInviteRights({
        userId: params.userId as string,
        organizationId: params.organizationId,
        schoolId,
        roomId,
      });
    });
  }
  // Chunk promises into batches of 50
  let chunks = [];
  const chunkSize = 50;
  for (let i = 0; i < validatePermissionsPromises.length; i += chunkSize) {
    chunks.push(validatePermissionsPromises.slice(i, i + chunkSize));
  }
  // Run chunks in sequence
  for (const chunk of chunks) {
    await Promise.all(chunk);
  }

  // Permissions validated! Create invites and send them out
  // Create invites
  const invites = await dbClient.$transaction(
    params.invites.map((invite) =>
      dbClient.invite.create({
        data: {
          email: invite.email,
          organizationId: params.organizationId,
          permissions: {
            create: {
              type: inviteRoleToPermissionTypeMap[invite.role],
              organizationId: params.organizationId,
              schoolId: invite.school
                ? schoolNameToIdMap.get(invite.school) || undefined
                : undefined,
              roomId: invite.classroom
                ? roomNameToIdMap.get(invite.classroom) || undefined
                : undefined,
            },
          },
        },
      })
    )
  );
  // Send invite emails
  await Promise.all(
    invites.map((invite) =>
      sendInviteEmail({
        invite,
      })
    )
  );
  return invites;
};
