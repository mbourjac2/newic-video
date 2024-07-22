module.exports = {
  plugins: ['@prettier/plugin-php'],
  singleQuote: true,
  overrides: [
    {
      files: '*.php',
      options: {
        braceStyle: '1tbs',
      },
    },
  ],
};
