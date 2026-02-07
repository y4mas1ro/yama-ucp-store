import { z } from "zod";
import { apiCall, setSessionToken } from "../state";

export const registerAuthTools = (server: any) => {
    server.tool(
        "login",
        {
            username: z.string().describe("Username"),
            password: z.string().describe("Password")
        },
        async ({ username, password }: any) => {
            const data = await apiCall("/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password })
            });
            setSessionToken(data.token);
            return {
                content: [{ type: "text", text: `Successfully logged in as ${username}. Session token stored.` }],
            };
        }
    );
};
