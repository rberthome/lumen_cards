const { FlatCompat } = require('@eslint/eslintrc');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

const compat = new FlatCompat();

module.exports = [
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'max-lines': ['warn', { max: 200 }],
      complexity: ['warn', 10],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='fetch']",
          message: 'Utiliser React Query, pas fetch() directement dans les composants.',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
