export enum Environment {
  Production = "production",
  Sandbox = "sandbox",
  Local = "local",
  Test = "test",
}

export const isProduction = () =>
  process.env.NODE_ENV === Environment.Production;
export const isSandbox = () => process.env.NODE_ENV === Environment.Sandbox;
export const isLocal = () => process.env.NODE_ENV === Environment.Local;
export const isTest = () => process.env.NODE_ENV === Environment.Test;

export const getEnv = () => {
  if (isProduction()) {
    return Environment.Production;
  }
  if (isSandbox()) {
    return Environment.Sandbox;
  }
  if (isTest()) {
    return Environment.Test;
  }
  return Environment.Local;
};

export const getOrigin = () => {
  if (isProduction()) {
    return "https://app.judie.io";
  }
  if (isSandbox()) {
    return "https://app.sandbox.judie.io";
  }
  return "http://localhost:3000";
};
