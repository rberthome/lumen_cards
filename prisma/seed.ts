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

  const categories = [
    {
      name: "Philosophie",
      slug: "philosophie",
      coverEmoji: "🕊️",
      sortOrder: 1,
    },
    { name: "Kabbale", slug: "kabbale", coverEmoji: "✡️", sortOrder: 2 },
    {
      name: "Franc-maçonnerie",
      slug: "franc-maconnerie",
      coverEmoji: "🛠️",
      sortOrder: 3,
    },
  ];
  for (const c of categories) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  console.log(
    `✓ Admin seedé : ${email} / changeme (à changer à la 1ʳᵉ connexion)`,
  );
  console.log(`✓ ${categories.length} catégories seedées`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
