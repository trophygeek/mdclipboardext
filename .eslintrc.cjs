module.exports = {
  root: true,
  env: { browser: true, es2020: true, webextensions: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "google", // Add Google style guide here
    "prettier", // Make sure this is the last
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "no-unused-vars": "off", // Keep this off to avoid conflicts
    "@typescript-eslint/no-unused-vars": ["warn"],
    // Override or add Google-specific rules as needed
    quotes: [
      "error",
      "single", // Use single quotes
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    semi: ["error", "always"], // Enforce semicolons
    "object-curly-spacing": ["error", "always"], // Consistent spacing inside braces
    "array-bracket-spacing": ["error", "never"], // No spaces inside array brackets
    "space-before-blocks": ["error", "always"], // Space before block openings
    "keyword-spacing": ["error", { before: true, after: true }], // Space around keywords
    "comma-dangle": ["error", "always-multiline"], // Trailing commas where valid
    "arrow-parens": ["error", "always"], // Always use parenthesis around arrow function arguments
    "no-multi-spaces": "error", // Disallow multiple spaces
    "space-in-parens": ["error", "never"], // No spaces inside parentheses
    "eol-last": ["error", "always"], // Enforce newline at end of file
    "no-trailing-spaces": "error", // Disallow trailing whitespace
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterOverload: true },
    ], // Require blank lines between class members
    "no-empty-function": "warn", // Warn on empty functions
    "@typescript-eslint/explicit-function-return-type": "warn", // Require explicit return types for functions
    "@typescript-eslint/no-inferrable-types": "warn", // Warn on inferrable types
    "@typescript-eslint/consistent-type-assertions": "warn", // Warn on inconsistent type assertions
    "@typescript-eslint/no-non-null-assertion": "warn", // Warn on non-null assertions
    "@typescript-eslint/no-var-requires": "warn", // Warn on using var requires
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          "{}": {
            message:
              "Avoid using the `{}` type. It can be unclear about what the object represents.",
            fixWith: "Record<string, unknown>",
          },
          object: {
            message:
              "Avoid using the `object` type. It can be unclear about what the object represents.",
            fixWith: "Record<string, unknown>",
          },
          Function: {
            message:
              "Avoid using the `Function` type. Prefer a more specific function type.",
            fixWith: "() => void",
          },
        },
      },
    ],
    "@typescript-eslint/array-type": ["error", { default: "array-simple" }], // Prefer simple array type syntax
  },
};
