import { baseFetch } from "./baseFetch";

export const GET_ME = "GET_ME";
export const getMeQuery = async () => {
  const response = await baseFetch({
    url: "/user/me",
    method: "GET",
  });
  return response.data;
};
