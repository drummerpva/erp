module.exports = {
  extends: [
    '@rocketseat/eslint-config/node',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['simple-import-sort', 'import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'no-use-before-define': 'off',
    'no-new': 'off',
    'import/no-named-as-default': 'off',
    'import/no-restricted-paths': [
      'error',
      {
        basePath: __dirname,
        zones: [
          {
            target: './src/domain',
            from: ['./'],
            except: ['./src/domain'],
            message:
              'A camada domain não pode depender de application, infra, external e bibliotecas externas',
          },
          {
            target: './src/application',
            from: ['./'],
            except: ['./src/application', './src/domain'],
            message:
              'A camada application não pode depender de infra, external e bibliotecas externas',
          },
          {
            target: './src/infra',
            from: ['./'],
            except: ['./src/infra', './src/application', './src/domain'],
            message:
              'A camada infra não pode depender de external e bibliotecas externas',
          },
        ],
      },
    ],
  },
}
