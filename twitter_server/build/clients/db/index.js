"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const client_1 = require("@prisma/client");
// export const prismaClient = new PrismaClient();
exports.prismaClient = new client_1.PrismaClient({ log: ["query"] });
