import { Chat, Message, User } from "@prisma/client";

// These types are for the web app to read from
// Basically DTOs, but our DTO-PTO layer is handled by Prisma
export interface JudieUser extends User {}
export interface JudieChat extends Chat {}
export interface JudieMessage extends Message {}
