import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: "test@luka.com" },
    update: {},
    create: {
      email: "test@luka.com",
      name: "Test User",
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create sources for the test user
  const sources = await Promise.all([
    prisma.source.create({
      data: {
        userId: user.id,
        name: "Bancolombia Ahorros",
        type: "BANK_ACCOUNT",
        subtype: "SAVINGS",
        balance: 8900000,
        color: "#f5a623",
        sourceNumber: "2378",
        active: true,
      },
    }),
    prisma.source.create({
      data: {
        userId: user.id,
        name: "Nequi",
        type: "BANK_ACCOUNT",
        subtype: "SAVINGS",
        balance: 500000,
        color: "#9013fe",
        sourceNumber: "8945",
        active: true,
      },
    }),
    prisma.source.create({
      data: {
        userId: user.id,
        name: "Efectivo",
        type: "CASH",
        subtype: null,
        balance: 200000,
        color: "#4a90e2",
        sourceNumber: null,
        active: true,
      },
    }),
    prisma.source.create({
      data: {
        userId: user.id,
        name: "Tarjeta Crédito Visa",
        type: "CARD",
        subtype: "CREDIT_CARD",
        balance: 3000000,
        color: "#50e3c2",
        sourceNumber: "4532",
        active: true,
      },
    }),
    prisma.source.create({
      data: {
        userId: user.id,
        name: "Davivienda (Inactiva)",
        type: "BANK_ACCOUNT",
        subtype: "CHECKING",
        balance: 0,
        color: "#f5a623",
        sourceNumber: "7890",
        active: false,
        deletedAt: new Date(),
      },
    }),
  ]);

  console.log(`✅ Created ${sources.length} sources`);

  // Calculate total balance
  const totalBalance = sources
    .filter((s) => s.active)
    .reduce((sum, s) => sum + s.balance, 0);

  console.log("\n📊 Summary:");
  console.log(`  User: ${user.email}`);
  console.log(
    `  Total active sources: ${sources.filter((s) => s.active).length}`,
  );
  console.log(
    `  Total balance: ${totalBalance.toLocaleString("es-CO", { style: "currency", currency: "COP" })}`,
  );

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
