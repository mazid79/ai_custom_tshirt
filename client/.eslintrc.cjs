module.exports = {
  root: true,
  env: { node: true, browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 2023, sourceType: 'module' },
  settings: {
    react: {
      version: '18.2',
      // Add the component and the allowed properties
      'pragma': 'React', // Change 'React' to the pragma used in your code (if different)
      'components': {
        'CustomComponent': {
          'ambientLight': ['intensity'],
          'mesh': ['castShadow'],
          'material': ['material-roughness'],
          'CameraRig': ['children'],
        },
      },
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    "react/no-unknown-property": 'off',
    'no-unused-vars': 'warn',
  },
};


