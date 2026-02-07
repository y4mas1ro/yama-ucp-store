"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAllTools = void 0;
const auth_1 = require("./auth");
const products_1 = require("./products");
const cart_1 = require("./cart");
const checkout_1 = require("./checkout");
const registerAllTools = (server) => {
    (0, auth_1.registerAuthTools)(server);
    (0, products_1.registerProductTools)(server);
    (0, cart_1.registerCartTools)(server);
    (0, checkout_1.registerCheckoutTools)(server);
};
exports.registerAllTools = registerAllTools;
