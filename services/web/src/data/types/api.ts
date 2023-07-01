export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  PAST_DUE = "PAST_DUE",
}

export enum SubscriptionType {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum GradeYear {
  FIRST = "FIRST",
  SECOND = "SECOND",
  THIRD = "THIRD",
  FOURTH = "FOURTH",
  FIFTH = "FIFTH",
  SIXTH = "SIXTH",
  SEVENTH = "SEVENTH",
  EIGHTH = "EIGHTH",
  FRESHMAN = "FRESHMAN",
  SOPHOMORE = "SOPHOMORE",
  JUNIOR = "JUNIOR",
  SENIOR = "SENIOR",
  UNI_FRESHMAN = "UNI_FRESHMAN",
  UNI_SOPHOMORE = "UNI_SOPHOMORE",
  UNI_JUNIOR = "UNI_JUNIOR",
  UNI_SENIOR = "UNI_SENIOR",
  GRADUATE = "GRADUATE",
}

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  type: SubscriptionType;
  stripeId: string;
  user: User;
}

export interface Invite {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  schoolId?: string;
  organizationId?: string;
  roomId?: string;
  gradeYear?: GradeYear;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  school?: School;
  organization?: Organization;
  room?: Room;
  permissions?: Permission[];
}

export interface School {
  id: string;
  name: string;
  address: string;
  organizationId: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt: string;
  rooms?: Room[];
}
export interface Organization {
  id: string;
  name: string;
  primaryContactEmail: string;
  creatorId: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  schools?: School[];
  rooms?: Room[];
}
export interface Room {
  id: string;
  name: string;
  schoolId: string;
  school: string;
  organizationId: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  users?: User[];
}
export interface Permission {
  id: string;
  userId: string;
  inviteId: string;
  schoolId: string;
  organizationId: string;
  roomId: string;
  type: PermissionType;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  deletedAt: string;
  school?: School;
  organization?: Organization;
  room?: Room;
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  receivePromotions: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  role: UserRole;
  stripeCustomerId?: string;
  questionsAsked: number;
  subscription?: Subscription;
  chats?: Chat[];
  permissions?: Permission[];
  organizations?: Organization[];
  schools?: School[];
  createdOrganizations?: Organization[];
  rooms?: Room[];
}

export enum MessageType {
  BOT = "BOT",
  USER = "USER",
  SYSTEM = "SYSTEM",
}
export interface Message {
  id: string;
  content: string;
  readableContent: string;
  type: MessageType;
  chatId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Chat {
  id: string;
  userId: string;
  usertitle?: string;
  createdAt: Date;
  updatedAt: Date | null;
  messages: Message[];
}

export enum UserRole {
  ADMINISTRATOR = "ADMINISTRATOR",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  JUDIE = "JUDIE",
}

export enum PermissionType {
  ORG_ADMIN = "ORG_ADMIN",
  SCHOOL_ADMIN = "SCHOOL_ADMIN",
  ROOM_ADMIN = "ROOM_ADMIN",
  STUDENT = "STUDENT",
}

export interface EntitiesResponse {
  organizations?: Organization[];
  schools?: School[];
  rooms?: Room[];
}
