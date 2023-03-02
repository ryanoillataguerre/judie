const config: { [key: string]: string } = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
};

for (const key in config) {
  if (!config[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export default config;
