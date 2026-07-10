const env = {
  appwrite: {
    // Keep direct references so Next.js can inline NEXT_PUBLIC_* values in the browser bundle.
    // Endpoint and project ID are public Appwrite configuration, so deployment-safe
    // defaults are used when Vercel variables have not been configured yet.
    endpoint:
      process.env.NEXT_PUBLIC_APPWRITE_HOST_URL ||
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
      "https://sgp.cloud.appwrite.io/v1",
    projectId:
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
      "6a50bb5600167212eebb",
    apikey: process.env.APPWRITE_API_KEY
  }
}

export default env
