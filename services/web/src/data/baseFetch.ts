import { getCookie, setCookie } from "cookies-next";
import { NextApiResponse } from "next";
import cookie from "cookie";

export enum ServiceEnum {
  APP = "app",
  EXPLANATIONS = "explanations",
  ANALYTICS = "analytics",
}

export enum Environment {
  LOCAL = "local",
  DEV = "dev",
  PROD = "production",
}

export const SESSION_COOKIE = "judie_sid";

const isClient = () => {
  return typeof window !== "undefined";
};

const getApiUri = () => {
  switch (process.env.NEXT_PUBLIC_NODE_ENV ?? Environment.LOCAL) {
    case Environment.LOCAL:
      if (isClient()) return "http://localhost:8080";
      return "http://app-service:8080";
    case Environment.DEV:
      return process.env.NEXT_PUBLIC_API_URI || "http://app-service:8080";
    case Environment.PROD:
      return process.env.NEXT_PUBLIC_API_URI || "http://app-service:8080";
    default:
      return "http://app-service:8080";
  }
};

export interface BaseFetchOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: { [key: string]: string };
  body?: any;
  access_token?: string;
  res?: NextApiResponse;
  service?: ServiceEnum;
  stream?: boolean;
  onChunkReceived?: (chunk: string) => void;
  onStreamEnd?: () => void;
}

export class HTTPResponseError extends Error {
  response?: any;
  constructor(response: any, status: number, ...args: any[]) {
    super(
      response.statusText || response?.error?.message,
      // @ts-ignore
      ...args
    );
    this.response = {
      ...response,
      code: Number(status),
    };
  }
}

const checkStatus = async (response: Response) => {
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

const checkForCookies = (response: Response) => {
  if (isClient()) {
    const cookieHeader = response.headers.get("Set-Cookie");
    const cookieContent = cookie.parse(cookieHeader || "");
    if (cookieContent) {
      setCookie(SESSION_COOKIE, cookieContent.judie_sid);
    }
    return;
  } else {
    return;
  }
};

export async function baseFetch({
  url,
  method,
  body,
  headers,
  stream,
  onChunkReceived,
  onStreamEnd,
}: BaseFetchOptions): Promise<any> {
  const apiUri = getApiUri();
  // Will resolve on client side
  try {
    const reqHeaders: any = {
      "Content-Type": "application/json",
      ...headers,
    };
    const sessionCookie = getCookie(SESSION_COOKIE);
    if (sessionCookie) {
      reqHeaders.Cookie = `judie_sid=${sessionCookie};`;
    }
    if (stream) {
      fetch(`${apiUri}${url}`, {
        headers: reqHeaders,
        credentials: "include",
        method,
        body: body ? JSON.stringify(body) : null,
      }).then(async (res) => {
        const reader = res.body?.getReader();
        while (true) {
          const result = await reader?.read();
          if (result?.done) {
            onStreamEnd?.();
            return;
          }
          if (result?.value) {
            const chunk = new TextDecoder("utf-8").decode(result.value);
            onChunkReceived?.(chunk);
          }
        }
      });
    } else {
      const response = await fetch(`${apiUri}${url}`, {
        headers: reqHeaders,
        credentials: "include",
        method,
        body: body ? JSON.stringify(body) : null,
      });
      await checkStatus(response);
      return response.json();
    }
  } catch (err: any) {
    throw err;
  }
}
