import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': ['error', { args: 'after-used', ignoreRestSiblings: true }],
      'no-console': 'warn',
      'eqeqeq': ['error', 'always'],
      'prefer-const': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'error',
    },
    plugins: {
      react: require('eslint-plugin-react'),
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
