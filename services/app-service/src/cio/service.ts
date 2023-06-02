import { User } from "@prisma/client";
import { apiClient } from "../utils/customerio.js";
import { SendEmailRequest } from 'customerio-node';

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
    })
    return await apiClient.sendEmail(newEmail);
}