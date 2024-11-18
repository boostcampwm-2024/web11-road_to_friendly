import eslintPluginImport from 'eslint-plugin-import';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    files: ['**/*.ts'], // 규칙을 적용할 파일
    languageOptions: {
      // 언어 옵션
      parser: typescriptParser, // TS 파싱
      parserOptions: {
        // TS프로젝트의 설정을 ESlint에 알려주는 옵션
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin, // TypeScript 관련 ESLint 규칙을 제공
      import: eslintPluginImport, // import 문법과 관련된 규칙을 제공
      prettier: prettier, // Prettier 플러그인 추가
    },
    rules: {
      //'prettier/prettier': 'error', // Prettier 규칙을 위반하면 ESLint에서 에러로 처리
      '@typescript-eslint/interface-name-prefix': 'off', // 인터페이스 이름에 접두사를 요구하는 규칙
      '@typescript-eslint/explicit-function-return-type': 'off', // 함수의 반환 타입을 명시적으로 작성하는 것을 요구하는 규칙
      '@typescript-eslint/explicit-module-boundary-types': 'off', // 모듈 경계의 타입을 명시적으로 작성하는 것을 요구하는 규칙
      '@typescript-eslint/no-explicit-any': 'off', // any 타입을 사용할 수 없도록 하는 규칙
      '@typescript-eslint/no-unused-vars': 'error', // 사용되지 않는 변수 경고,
      'import/prefer-default-export': 'off',
      'import/order': 'off', // import 구문의 순서를 요구하는 규칙
      'import/no-default-export': 'error',
      'import/extensions': 'off',
      curly: ['error', 'all'], // 모든 제어문(if, for 등)에서 중괄호를 강제하도록 설정
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
    },
  },
];
