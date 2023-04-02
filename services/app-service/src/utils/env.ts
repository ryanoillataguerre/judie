export const isProduction = () => process.env.NODE_ENV === "production";
export const isSandbox = () => process.env.NODE_ENV === "sandbox";
