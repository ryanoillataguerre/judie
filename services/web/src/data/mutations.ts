import { baseFetch } from "./baseFetch";

export const GET_COMPLETION_QUERY = "GET_COMPLETION_QUERY";
export const completionFromQueryMutation = async ({
  query,
  newChat = false,
}: {
  query: string;
  newChat?: boolean;
}) => {
  const response = await baseFetch({
    url: "/chat/completion",
    method: "POST",
    body: { query, newChat },
  });
  return response.data;
};

export const signinMutation = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await baseFetch({
    url: "/auth/signin",
    method: "POST",
    body: { email, password },
  });
  return response.data;
};
