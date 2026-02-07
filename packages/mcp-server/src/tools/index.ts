import { registerAuthTools } from "./auth";
import { registerProductTools } from "./products";
import { registerCartTools } from "./cart";
import { registerCheckoutTools } from "./checkout";

export const registerAllTools = (server: any) => {
    registerAuthTools(server);
    registerProductTools(server);
    registerCartTools(server);
    registerCheckoutTools(server);
};
