import { useState } from 'react';

export function useIndex(length: number, startIndex: number = 0): [number, Function] {
  const [index, setIndex] = useState(startIndex % length);
  function addIndex() {
    if (index >= length - 1) setIndex(0);
    else setIndex(index + 1);
  }
  return [index, addIndex];
}
