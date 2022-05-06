"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
require("dotenv/config");
const server = (0, fastify_1.default)();
const Home_1 = __importDefault(require("./routes/Home"));
const registerPlugin = (plugin) => {
    server.register(plugin);
};
registerPlugin(Home_1.default);
server.listen(process.env.PORT, (err, adress) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${adress}`);
});
