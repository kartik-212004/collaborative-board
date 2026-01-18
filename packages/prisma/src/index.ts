import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "@repo/env";
import "dotenv/config";

import { PrismaClient } from "./generated/prisma/client.js";

const connectionString = `${DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
