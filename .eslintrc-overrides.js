// ESLint override to allow explicit 'any' in the whole project
module.exports = {
  overrides: [
    {
      files: ['**/*.ts', '**/*.vue'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
