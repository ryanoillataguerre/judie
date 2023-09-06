import { Prisma } from "@prisma/client";

export type PrismaNext = (params: Prisma.MiddlewareParams) => Promise<any>;

export type PrismaMiddleware = (
  params: Prisma.MiddlewareParams,
  next: PrismaNext
) => Promise<PrismaNext>;

export const CoreModel = Prisma.ModelName;
export type CoreModelType = (typeof CoreModel)[keyof typeof CoreModel];

export const SOFT_DELETE_MODELS: CoreModelType[] = [
  CoreModel.User,
  CoreModel.Subscription,
  CoreModel.Chat,
  CoreModel.ChatAssignment,
  CoreModel.ChatFolder,
  CoreModel.Message,
  CoreModel.MessageMetadata,
  CoreModel.WaitlistEntry,
  CoreModel.Organization,
  CoreModel.School,
  CoreModel.Room,
  CoreModel.Permission,
  CoreModel.Invite,
  CoreModel.Seats,
];

export const hideSoftDelete: PrismaMiddleware = async (params, next) => {
  // Check incoming query type
  if (params.model && SOFT_DELETE_MODELS.includes(params.model)) {
    if (params.action === "findUnique" || params.action === "findFirst") {
      // Change to findFirst - you cannot filter
      // by anything except ID / unique with findUnique
      params.action = "findFirst";
      // Add 'deleted' filter
      // ID filter maintained
      if (params.args.where["deletedAt"] == undefined) {
        // Exclude deletedAt records if they have not been explicitly requested
        params.args.where["deletedAt"] = null;
      }
    }
    if (params.action === "findMany") {
      // Find many queries
      if (params.args.where) {
        if (params.args.where.deletedAt == undefined) {
          // Exclude deletedAt records if they have not been explicitly requested
          params.args.where["deletedAt"] = null;
        }
      } else {
        params.args["where"] = { deletedAt: null };
      }
    }
    if (params.action == "update") {
      // Change to updateMany - you cannot filter
      // by anything except ID / unique with findUnique
      params.action = "updateMany";
      // Add 'deleted' filter
      // ID filter maintained
      params.args.where["deletedAt"] = null;
    }
    if (params.action == "updateMany") {
      if (params.args.where != undefined) {
        params.args.where["deletedAt"] = null;
      } else {
        params.args["where"] = { deletedAt: null };
      }
    }
  }
  return next(params);
};

/**
 * This middleware prevents deleting a model and
 * instead updates a deletedAt boolean property
 */
export const softDelete: PrismaMiddleware = async (params, next) => {
  // Check incoming query type
  if (params.model && SOFT_DELETE_MODELS.includes(params.model)) {
    if (params.action == "delete") {
      // Delete queries
      // Change action to an update
      params.action = "update";
      params.args["data"] = { deletedAt: new Date() };
    }
    if (params.action == "deleteMany") {
      /** This allows us to actually delete the tables when forced */
      // if (Object.isEmpty(params.args["where"])) {
      //   console.warn(`FORCE DELETING ALL ${params.model}`);
      // } else {
      console.log({ ARGS: params.args });
      // Delete many queries
      params.action = "updateMany";
      if (params.args.data != undefined) {
        params.args.data["deletedAt"] = new Date();
      } else {
        params.args["data"] = { deletedAt: new Date() };
      }
    }
  }
  return next(params);
};
