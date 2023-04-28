export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  PAST_DUE = "PAST_DUE",
}

export enum SubscriptionType {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  type: SubscriptionType;
  stripeId: string;
  user: User;
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
  district?: string;
  stripeCustomerId?: string;
  questionsAsked: number;
  subscription?: Subscription;
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
