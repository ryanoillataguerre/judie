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
  FIRST,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH,
  SIXTH,
  SEVENTH,
  EIGHTH,
  FRESHMAN,
  SOPHOMORE,
  JUNIOR,
  SENIOR,
  UNI_FRESHMAN,
  UNI_SOPHOMORE,
  UNI_JUNIOR,
  UNI_SENIOR,
  GRADUATE,
}

export const gradeYearToNameMap = {
  [GradeYear.FIRST]: "1st",
  [GradeYear.SECOND]: "2nd",
  [GradeYear.THIRD]: "3rd",
  [GradeYear.FOURTH]: "4th",
  [GradeYear.FIFTH]: "5th",
  [GradeYear.SIXTH]: "6th",
  [GradeYear.SEVENTH]: "7th",
  [GradeYear.EIGHTH]: "8th",
  [GradeYear.FRESHMAN]: "Freshman",
  [GradeYear.SOPHOMORE]: "Sophomore",
  [GradeYear.JUNIOR]: "Junior",
  [GradeYear.SENIOR]: "Senior",
  [GradeYear.UNI_FRESHMAN]: "College Freshman",
  [GradeYear.UNI_SOPHOMORE]: "College Sophomore",
  [GradeYear.UNI_JUNIOR]: "College Junior",
  [GradeYear.UNI_SENIOR]: "College Senior",
  [GradeYear.GRADUATE]: "Graduate",
};

export const getGradeYearName = (gradeYear: GradeYear) => {
  return gradeYearToNameMap[gradeYear];
};

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  type: SubscriptionType;
  organizationId?: string;
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
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
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

export enum Purpose {
  PERSONAL,
  TEST_PREP,
  CLASSES,
  HOMESCHOOLING,
}

const purposeToNameMap = {
  [Purpose.PERSONAL]: "Personal",
  [Purpose.TEST_PREP]: "Test Prep",
  [Purpose.CLASSES]: "Classes",
  [Purpose.HOMESCHOOLING]: "Homeschooling",
};

export const getPurposeName = (purpose: Purpose) => {
  return purposeToNameMap[purpose];
};

// Not enforced in the schema, but should remain a list here
export enum PrepForTest {
  SAT,
  ACT,
  LSAT,
  MCAT,
  GMAT,
  GRE,
  DAT,
}

export interface UserProfile {
  purpose: Purpose;
  prepForTest: PrepForTest;
  gradeYear: GradeYear;
  country: string;
  state: string;
  subjects: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
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
  lastMessageAt?: Date;
  dateOfBirth?: Date;
  parentalConsent?: boolean;
  parentalConsentEmail?: string;
  chats?: Chat[];
  permissions?: Permission[];
  organizations?: Organization[];
  schools?: School[];
  createdOrganizations?: Organization[];
  rooms?: Room[];
  profile?: UserProfile;
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
  audioFileUrl?: string;
  type: MessageType;
  chatId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ChatFolder {
  id: string;
  userId: string;
  userTitle: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  chats?: Chat[];
  _count?: {
    chats: number;
  };
}

export interface Chat {
  id: string;
  userId: string;
  userTitle?: string;
  subject?: string;
  createdAt: Date;
  updatedAt: Date | null;
  messages: Message[];
  folder?: ChatFolder;
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
