module.exports = {
  extends: ['../../.eslintrc.js', 'next/core-web-vitals'],
  rules: {
    // Disable rules that are problematic in demo/example files
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@next/next/no-img-element': 'off',
  },
};
