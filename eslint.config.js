import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Base recommended config
  js.configs.recommended,
  
  // Global ignores
  {
    ignores: ['dist/**', '.eslintrc.cjs', 'node_modules/**'],
  },
  
  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        browser: 'readonly',
        chrome: 'readonly',
        webextensions: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Base TypeScript ESLint recommended rules
      ...tseslint.configs.recommended.rules,
      
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      
      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // TypeScript-specific rules
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off', // Keep this off to avoid conflicts
      '@typescript-eslint/no-unused-vars': ['warn'],
      
      // Style rules (previously from Google config)
      quotes: [
        'error',
        'single', // Use single quotes
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      semi: ['error', 'always'], // Enforce semicolons
      'object-curly-spacing': ['error', 'always'], // Consistent spacing inside braces
      'array-bracket-spacing': ['error', 'never'], // No spaces inside array brackets
      'space-before-blocks': ['error', 'always'], // Space before block openings
      'keyword-spacing': ['error', { before: true, after: true }], // Space around keywords
      'comma-dangle': ['error', 'always-multiline'], // Trailing commas where valid
      'arrow-parens': ['error', 'always'], // Always use parenthesis around arrow function arguments
      'no-multi-spaces': 'error', // Disallow multiple spaces
      'space-in-parens': ['error', 'never'], // No spaces inside parentheses
      'eol-last': ['error', 'always'], // Enforce newline at end of file
      'no-trailing-spaces': 'error', // Disallow trailing whitespace
      'lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: false },
      ], // Require blank lines between class members
      'no-empty-function': 'warn', // Warn on empty functions
      
      // TypeScript style rules
      '@typescript-eslint/explicit-function-return-type': 'warn', // Require explicit return types for functions
      '@typescript-eslint/no-inferrable-types': 'warn', // Warn on inferrable types
      '@typescript-eslint/consistent-type-assertions': 'warn', // Warn on inconsistent type assertions
      '@typescript-eslint/no-non-null-assertion': 'warn', // Warn on non-null assertions
      '@typescript-eslint/no-var-requires': 'warn', // Warn on using var requires
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }], // Prefer simple array type syntax
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }], // Allow empty interfaces
    },
  },
  
  // Prettier config (must be last to override conflicting rules)
  prettier,
];
