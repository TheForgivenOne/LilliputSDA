import tseslint from "typescript-eslint";

const eslintConfig = tseslint.config(
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**", "next-env.d.ts", "convex/_generated/**"],
  },
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  }
);

export default eslintConfig;
