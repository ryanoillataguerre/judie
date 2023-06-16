export enum Environment {
  Production = "production",
  Sandbox = "sandbox",
  Local = "local",
}

export const isProduction = () =>
  process.env.NODE_ENV === Environment.Production;
export const isSandbox = () => process.env.NODE_ENV === Environment.Sandbox;

export const getEnv = () => {
  if (isProduction()) {
    return Environment.Production;
  }
  if (isSandbox()) {
    return Environment.Sandbox;
  }
  return Environment.Local;
};
