module.exports = {
  extends: ['@rocketseat/eslint-config/node'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'no-use-before-define': 'off',
    'no-new': 'off',
  },
}
