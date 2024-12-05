import { useState } from 'react';

export function useIndex(
  length: number,
  startIndex: number = 0,
  canLoop: boolean = true
): [number, Function, Function] {
  const [index, setIndex] = useState(startIndex % length);
  function addIndex() {
    if (index >= length - 1) setIndex(canLoop ? 0 : index);
    else setIndex(index + 1);
  }
  function subIndex() {
    if (index <= 0) setIndex(canLoop ? length - 1 : index);
    else setIndex(index - 1);
  }
  return [index, addIndex, subIndex];
}
