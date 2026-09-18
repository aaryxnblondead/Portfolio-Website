import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";

const compat = new FlatCompat({
  baseDirectory: fileURLToPath(new URL(".", import.meta.url)),
});

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [".next/**", ".next-dev/**", "out/**", "public/photos/**"],
  },
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];
