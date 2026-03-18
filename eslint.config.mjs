import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // This rule is new and currently over-flags normal initialization patterns
      // (reading localStorage/matchMedia and then setting state).
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["scripts/**/*.{js,cjs}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default config;

