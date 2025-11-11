"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'admin@local';
    const password = 'admin123';
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const exists = await prisma.user.findUnique({ where: { email } });
    if (!exists) {
        await prisma.user.create({
            data: {
                email,
                nombre: 'Admin',
                passwordHash,
                role: client_1.Role.ADMIN
            }
        });
        console.log(`Seed OK: usuario admin -> ${email} / ${password}`);
    }
    else {
        console.log('Seed: admin ya existe, omitido.');
    }
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map