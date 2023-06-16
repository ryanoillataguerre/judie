export enum Environment {
  Production = "production",
  Sandbox = "sandbox",
  Local = "local",
}

export const isProduction = () =>
  process.env.NEXT_PUBLIC_NODE_ENV === Environment.Production;
export const isSandbox = () =>
  process.env.NEXT_PUBLIC_NODE_ENV === Environment.Sandbox;
export const isLocal = () =>
  process.env.NEXT_PUBLIC_NODE_ENV === Environment.Local;

export const getEnv = () => {
  if (isProduction()) {
    return Environment.Production;
  }
  if (isSandbox()) {
    return Environment.Sandbox;
  }
  return Environment.Local;
};
