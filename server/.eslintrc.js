module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'no-useless-escape': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    "@typescript-eslint/no-var-requires": 'off',
    "@typescript-eslint/no-explicit-any": 'off',
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     singleQuote: true,
    //     parser: 'typescript'
    //   }
    // ]
  }
}
