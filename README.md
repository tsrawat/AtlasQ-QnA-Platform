# AtlasQ

AtlasQ is a full-stack Q&A application built with Next.js and Appwrite.

## Local development

Copy `.env.example` to `.env.local`, fill in the Appwrite values, then run:

```bash
npm install
npm run dev
```

## Deploying to Vercel

Add all three variables from `.env.example` in **Vercel → Project → Settings → Environment Variables**. Enable them for Production and Preview, then redeploy. `NEXT_PUBLIC_*` values are embedded during the build, so a redeploy is required after changing them.

The endpoint may be named either `NEXT_PUBLIC_APPWRITE_HOST_URL` (used by this project's original setup) or `NEXT_PUBLIC_APPWRITE_ENDPOINT` (the name shown by newer Appwrite setup instructions). Only one endpoint variable is required.

This repository includes public fallback values for the AtlasQ Appwrite endpoint and project ID. Vercel still requires the private `APPWRITE_API_KEY`; never commit that key to the repository.

In **Appwrite Console → Project → Overview/Integrations → Platforms**, add a Web platform for every hostname that will access Appwrite:

- your production hostname, such as `your-project.vercel.app`
- your custom domain, if one is used
- `localhost` for local development

Enter hostnames only (without `https://` or a path). For changing Vercel preview URLs, add an Appwrite Web platform using the preview hostname pattern supported by your Appwrite setup, or add the preview hostname being tested.

Password recovery sends users back to `/reset-password` on the same hostname. That hostname must be registered as an Appwrite Web platform or Appwrite will reject the recovery URL.

The Appwrite API key used by the server must have access to databases, collections, attributes, indexes, documents, buckets/files, and users. Never prefix this key with `NEXT_PUBLIC_`.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```
