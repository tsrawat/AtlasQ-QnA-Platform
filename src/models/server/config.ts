import env from "@/app/env";

import {Avatars, Client, Databases, Storage, Users} from "node-appwrite"

let client = new Client();

if (!env.appwrite.apikey) {
    throw new Error("Missing required environment variable: APPWRITE_API_KEY");
}

client
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.apikey) // Your secret API key
    
;

const databases = new Databases(client)
const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client)


export { client, databases, users, avatars, storage}
