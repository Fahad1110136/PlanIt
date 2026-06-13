// ============================================
// PRISMA CLIENT - PlanIT
// ============================================
// Prisma 7 requires a driver adapter for the runtime client.
// We use @prisma/adapter-pg with the POOLED connection (DATABASE_URL).
// This same setup works for both local dev and production -
// there is no separate "test" client, since Neon IS our real DB.
// ============================================

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;