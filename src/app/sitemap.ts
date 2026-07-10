import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://atlasq.app";
    return [
        { url: base, lastModified: new Date() },
        { url: `${base}/questions`, lastModified: new Date() },
        { url: `${base}/login`, lastModified: new Date() },
        { url: `${base}/register`, lastModified: new Date() },
    ];
}
