import { z } from "zod";

// Variables d'environnement typées et validées au démarrage (côté serveur).
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().default("file:./dev.db"),
  // Secret de signature des sessions — À REMPLACER en prod.
  SESSION_SECRET: z
    .string()
    .min(16)
    .default("dev-secret-change-me-32-chars-min!"),
});

export const env = schema.parse(process.env);
export type Env = z.infer<typeof schema>;
