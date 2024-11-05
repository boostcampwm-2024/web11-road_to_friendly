import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // TypeScript 관련 설정
      '@typescript-eslint/no-explicit-any': 'warn', // any 사용 경고
      '@typescript-eslint/no-unused-vars': 'error', // 사용되지 않는 변수 경고

      // React 관련 설정
      'react/react-in-jsx-scope': 'off', // Reat 17+ 이상에서 React import 없이 사용 가능
      'react/prop-types': 'off', // TS 사용 시 PropTypes 생략
      'no-debugger': 'off', // debugger 사용 가능
      'no-console': 'off' // console 사용 가능
    }
  }
);
