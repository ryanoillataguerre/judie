import { baseFetch } from "./baseFetch";

export const GET_COMPLETION_QUERY = "GET_COMPLETION_QUERY";
export const completionFromQueryMutation = async (query: string) => {
  const response = await baseFetch({
    url: "/completion-web",
    method: "POST",
    body: JSON.stringify({ query }),
  });
  return response.data;
};
