module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['**/*_.js', '**/*_.js', '**/*_/*.js', 'dist/**/*.js'],
  rules: {
    'max-classes-per-file': 'off',
    'no-console': 'off',
    'no-constructor-return': 'off',
    'import/extensions': ['error',
      { js: 'always' },
    ],
    'import/no-relative-packages': 'off',
    'import/no-extraneous-dependencies': ['error', { includeInternal: true, packageDir: './' }],
  },
  settings: {
    'import/ignore': [
      '^https?://',
    ],
  },
};
