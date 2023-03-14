import { NextApiResponse } from "next";

export enum ServiceEnum {
  APP = "app",
  EXPLANATIONS = "explanations",
  ANALYTICS = "analytics",
}

const isClient = () => {
  return typeof window !== "undefined";
};

const getApiUri = () => {
  return "http://localhost:8080";
};

export interface BaseFetchOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: { [key: string]: string };
  body?: any;
  access_token?: string;
  res?: NextApiResponse;
  service?: ServiceEnum;
}

class HTTPResponseError extends Error {
  response?: any;
  constructor(response: any, status: number, ...args: any[]) {
    super(
      `HTTP Error Response: ${status} ${
        response.statusText || response?.error?.message
      }`,
      // @ts-ignore
      ...args
    );
    this.response = {
      ...response,
      code: Number(status),
    };
  }
}

const checkStatus = async (response: any) => {
  if (response.ok ?? false) {
    // response.status >= 200 && response.status < 300
    return response;
  } else {
    const responseBody = await response.json();
    if (responseBody && response?.status) {
      throw new HTTPResponseError(responseBody, response.status || 500);
    } else {
      throw new HTTPResponseError({ error: true }, 500);
    }
  }
};

export async function baseFetch({
  url,
  method,
  body,
  headers,
  res,
  service = ServiceEnum.APP,
}: BaseFetchOptions): Promise<any> {
  const apiUri = getApiUri();
  // Will resolve on client side
  try {
    const reqHeaders: any = {
      "Content-Type": "application/json",
      ...headers,
    };
    const response = await fetch(`${apiUri}${url}`, {
      headers: reqHeaders,
      credentials: "include",
      method,
      body: body ? JSON.stringify(body) : null,
    });
    await checkStatus(response);

    return response.json();
  } catch (err: any) {
    throw err;
  }
}
