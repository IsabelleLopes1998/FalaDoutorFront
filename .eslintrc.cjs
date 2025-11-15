module.exports = {
  env: { browser: true, es2021: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  parserOptions: { ecmaVersion: 2021, sourceType: "module", ecmaFeatures: { jsx: true } },
  plugins: ["react", "jsx-a11y", "react-hooks"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "no-console": "warn",
    "react/prop-types": "off"
  },
  settings: { react: { version: "detect" } }
};
