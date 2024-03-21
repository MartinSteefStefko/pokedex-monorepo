"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var fastify_1 = require("fastify");
var app_1 = require("./app/app");
var server_1 = require("./config/server");
// Instantiate Fastify with some config
var server = (0, fastify_1.default)({
    logger: true,
});
// Register your application as a normal plugin.
server.register(app_1.app);
// Start listening.
server.listen({ port: server_1.PORT, host: server_1.HOST }, function (err) {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    else {
        console.log("[ ready ] http://".concat(server_1.HOST, ":").concat(server_1.PORT));
    }
});
