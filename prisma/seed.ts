import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = "admin@lumencards.local";
  const passwordHash = await bcrypt.hash("changeme", 10);

  await db.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Admin",
      email,
      passwordHash,
      role: "admin",
      mustChangePassword: true,
    },
  });

  console.log(
    `✓ Admin seedé : ${email} / changeme (à changer à la 1ʳᵉ connexion)`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
