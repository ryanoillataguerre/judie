import { baseFetch } from "./baseFetch";

export const getCompletionFromQuery = async (query: string) => {
  const response = await baseFetch({
    url: "/completion-web",
    method: "POST",
    body: JSON.stringify({ query }),
  });
  return response.data;
};
