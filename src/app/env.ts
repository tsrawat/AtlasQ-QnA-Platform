function requiredPublicEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const env = {
  appwrite: {
    // Keep direct references so Next.js can inline NEXT_PUBLIC_* values in the browser bundle.
    endpoint: requiredPublicEnv(
      "NEXT_PUBLIC_APPWRITE_HOST_URL or NEXT_PUBLIC_APPWRITE_ENDPOINT",
      process.env.NEXT_PUBLIC_APPWRITE_HOST_URL || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
    ),
    projectId: requiredPublicEnv(
      "NEXT_PUBLIC_APPWRITE_PROJECT_ID",
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
    ),
    apikey: process.env.APPWRITE_API_KEY
  }
}

export default env
