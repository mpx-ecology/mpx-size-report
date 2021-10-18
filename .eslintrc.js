module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'standard',
  plugins: [
    'html',
    'jest'
  ],
  globals: {
  },
  rules: {
    'no-cond-assign': 0,
    'camelcase': ['error', { 'allow': ['__mpx_mode__', '__mpx_env__', '__swan_exports_map__'] }]
  },
  env: {
    'jest/globals': true
  }
}
