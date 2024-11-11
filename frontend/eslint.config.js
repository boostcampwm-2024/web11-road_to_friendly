import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals, { node } from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'eslint.config.js', 'vite.config.js'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, importPlugin.flatConfigs.recommended],
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
      'no-console': 'off', // console 사용 가능,

      // import 관련 설정
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['sibling', 'parent', 'index'], 'type', 'unknown'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before'
            },
            {
              pattern: 'react*',
              group: 'external',
              position: 'before'
            },
            {
              pattern: '@/hooks/*',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/components/*',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/pages/*',
              group: 'internal',
              position: 'before'
            }
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true, //import하는 모듈의 @type/**에서 .d.ts파일을 찾아 타입 추론
          project: './tsconfig.json' // tsconfig.json 파일의 위치를 명시. 생략 시, 현재 위치에서 가장 가까운 tsconfig.json이 인식됨
        },
        node: {
          paths: ['src'] //node_modules에서 모듈을 찾을 때 참고할 경로
        }
      }
    }
  }
);
