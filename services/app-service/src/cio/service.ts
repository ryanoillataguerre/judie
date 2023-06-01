import cioClient from "../utils/customerio.js";



export const sendUserForgotPasswordEmail = ({
    email,
    token,
}: {
    email: string;
    token: string;
}) => {
    // Send email
    return cioClient.
}