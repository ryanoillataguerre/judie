import { User, Invite } from "@prisma/client";
import { apiClient } from "../utils/customerio.js";
import { SendEmailRequest } from "customerio-node";
import { getOrigin } from "../utils/env.js";

export const sendUserForgotPasswordEmail = async ({
  user,
  url,
}: {
  user: User;
  url: string;
}) => {
  // Send email
  const newEmail = new SendEmailRequest({
    to: user.email,
    transactional_message_id: "2",
    message_data: {
      first_name: user.firstName,
      url,
    },
    identifiers: {
      id: user.id,
    },
  });
  return await apiClient.sendEmail(newEmail);
};

export const sendInviteEmail = async ({ invite }: { invite: Invite }) => {
  // Send email
  const newEmail = new SendEmailRequest({
    to: invite.email,
    transactional_message_id: "3",
    message_data: {
      first_name: invite.firstName,
      url: `${getOrigin()}/invite/${invite.id}`,
    },
    identifiers: {
      id: invite.id,
    },
  });
  return await apiClient.sendEmail(newEmail);
};

export const sendVerificationEmail = async ({ user }: { user: User }) => {
  // Send email
  const newEmail = new SendEmailRequest({
    to: user.email,
    transactional_message_id: "4",
    message_data: {
      first_name: user.firstName,
      url: `${getOrigin()}/verify/${user.id}`,
    },
    identifiers: {
      email: user.email,
    },
  });
  return await apiClient.sendEmail(newEmail);
};

export const sendSubscribedEmail = async ({ user }: { user: User }) => {
  // Send email
  const newEmail = new SendEmailRequest({
    to: user.email,
    transactional_message_id: "6",
    message_data: {
      first_name: user.firstName,
    },
    identifiers: {
      email: user.email,
    },
  });
  return await apiClient.sendEmail(newEmail);
};

export const sendWelcomeEmail = async ({ user }: { user: User }) => {
  // Send email
  // const newEmail = new SendEmailRequest({
  //   to: user.email,
  //   transactional_message_id: "5",
  //   message_data: {
  //     first_name: user.firstName,
  //   },
  //   identifiers: {
  //     email: user.email,
  //   },
  // });
  // return await apiClient.sendEmail(newEmail);
  return null;
};

export const sendParentalConsentEmail = async ({ user }: { user: User }) => {
  const parentalConsentUrl = `${getOrigin()}/parental-consent/${user.id}`;
  // Send email
  const newEmail = new SendEmailRequest({
    to: user.email,
    transactional_message_id: "7",
    message_data: {
      url: parentalConsentUrl,
    },
    identifiers: {
      email: user.email,
    },
  });
  return await apiClient.sendEmail(newEmail);
};

export const sendFeedbackEmail = async ({
  email,
  feedback,
}: {
  email: string;
  feedback: string;
}) => {
  const body = `Email:\n${email}\nFeedback:\n${feedback}`;
  // Send email
  const newEmail = new SendEmailRequest({
    to: "feedback@judie.io",
    transactional_message_id: "8",
    message_data: {
      body,
    },
    identifiers: {
      email: email,
    },
  });
  return await apiClient.sendEmail(newEmail);
};
