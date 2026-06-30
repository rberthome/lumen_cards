import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Règles SOLID — réf. PROJECT.md §7.
  {
    rules: {
      "max-lines": ["warn", { max: 200, skipBlankLines: true, skipComments: true }],
      complexity: ["warn", 10],
      "@typescript-eslint/no-explicit-any": "error",
      "no-restricted-syntax": [
        "warn",
        {
          selector: "CallExpression[callee.name='fetch']",
          message:
            "Côté client, passer par React Query — pas de fetch() nu dans un composant.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Fichiers vendored du design system + sortie Prisma.
    "docs/**",
    "src/generated/**",
  ]),
]);

export default eslintConfig;
