import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    plugins: [
        magicLinkClient(),
    ],
    // Base URL of auth server
    // Only necessary if auth server and client run on different domains
    // baseURL: "http://localhost:3000"
})