import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default [
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@stylistic': stylistic,
            '@typescript-eslint': tsPlugin,
            'import': importPlugin
        },
        rules: {
            // General JavaScript/TypeScript rules
            'no-console': 'off',

            // Spacing and formatting rules
            '@stylistic/arrow-spacing': ['warn', {before: true, after: true}],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/comma-spacing': ['warn', {before: false, after: true}],
            '@stylistic/keyword-spacing': ['warn', {before: true, after: true}],
            '@stylistic/object-curly-spacing': ['warn', 'always'],
            '@stylistic/space-before-blocks': 'warn',

            // Import sorting and organization
            'import/order': ['warn', {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                'newlines-between': 'always',
            }],

            // TypeScript-specific rules
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],

            // Specific preferences from the original config
            '@stylistic/indent': ['warn', 2],
            '@stylistic/max-len': ['warn', {code: 120}],
            '@stylistic/member-delimiter-style': ['warn', {
                multiline: {delimiter: 'semi', requireLast: true},
                singleline: {delimiter: 'semi', requireLast: false},
            }],

            // Chained method call preferences
            '@stylistic/dot-location': ['warn', 'property'],
        },
    }
];
