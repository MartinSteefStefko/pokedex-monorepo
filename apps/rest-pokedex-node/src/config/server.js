"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.HOST = void 0;
exports.HOST = (_a = process.env.HOST) !== null && _a !== void 0 ? _a : '0.0.0.0';
exports.PORT = process.env.REST_AUTH_NODE_PORT
    ? Number(process.env.REST_AUTH_NODE_PORT)
    : 3000;
