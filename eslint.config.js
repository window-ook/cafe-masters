import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:cypress/recommended"
  ),
  {
    rules: {
      "no-undef": "error",
      "import/no-unresolved": "off",
      "@typescript-eslint/no-require-imports": "off",
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          trailingComma: "all",
          printWidth: 80,
          bracketSpacing: true,
          arrowParens: "avoid",
        },
      ],
      "no-unused-vars": "off",
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
]; 