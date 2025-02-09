// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  extends: [
    'expo',
    'plugin:react-native/all'
  ],
  plugins: ['react-native'],
  rules: {
    'react-native/no-raw-text': 'off',
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
};
