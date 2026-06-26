import { z } from "zod";

// Variables d'environnement typées et validées au démarrage (côté serveur).
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().default("file:./dev.db"),
});

export const env = schema.parse(process.env);
export type Env = z.infer<typeof schema>;
