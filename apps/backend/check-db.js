
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db',
    },
  },
});

async function main() {
  try {
    await prisma.$connect();
    const count = await prisma.user.count();
    console.log(`User count: ${count}`);
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
