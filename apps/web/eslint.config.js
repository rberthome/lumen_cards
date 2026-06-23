import pluginVue from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['src/**/*.vue'],
    plugins: { vue: pluginVue, '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser, extraFileExtensions: ['.vue'], sourceType: 'module' },
    },
    rules: {
      ...pluginVue.configs['flat/recommended']?.rules,
      'vue/multi-word-component-names': 'off',
      'max-lines': ['warn', { max: 200 }],
      'complexity': ['warn', 10],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['src/**/*.ts'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: { parser: tsParser, parserOptions: { sourceType: 'module' } },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'max-lines': ['warn', { max: 200 }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
