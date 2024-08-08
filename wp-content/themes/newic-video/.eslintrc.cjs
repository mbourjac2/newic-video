module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  globals: {
    ajax_object: 'readonly',
    gsap: 'readonly',
    ScrollTrigger: 'readonly',
    L: 'readonly',
  },
  rules: {
    'prefer-const': 'error',
    'one-var': ['error', 'never'],
  },
};
