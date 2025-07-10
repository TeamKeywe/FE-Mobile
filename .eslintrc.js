module.exports = {
  root: true,
  env: {
    'react-native/react-native': true,
    es2021: true,
  },
  extends: [
    '@react-native-community', // RN 공식 커뮤니티 기본
    'plugin:react/recommended', // React 기본 권장 규칙
    'plugin:react-native/all', // React Native 권장 규칙
    'plugin:prettier/recommended', // Prettier 통합
  ],
  plugins: ['react', 'react-native', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off', // React 17+에서는 불필요
    'react-native/no-inline-styles': 'warn', // 인라인 스타일 경고
    'react-native/no-unused-styles': 'warn', // 미사용 스타일 경고
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
