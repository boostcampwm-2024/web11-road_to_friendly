import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';

// react-testing-library의 matcher를 확장한다.
// `@testing-library/jest-dom`의 matcher를 사용할 수 있게 된다.
expect.extend(matchers);

// test 간 DOM 상태를 초기화
afterEach(() => {
  cleanup();
});
