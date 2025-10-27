module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  env: {
    es2021: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript', 'plugin:prettier/recommended'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'import/order': [
      'error',
      {
        'alphabetize': { order: 'asc', caseInsensitive: true },
        'groups': [['builtin', 'external', 'internal'], ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        'pathGroups': [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
      },
    ],
  },
};
