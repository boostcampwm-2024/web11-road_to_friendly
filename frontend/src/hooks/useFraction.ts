import { useState } from 'react';

function getValueInRange(value: number) {
  if (value <= 0) return 0;
  else if (value >= 1) return 1;
  else return value;
}

export function useFraction(startValue: number): [number, (value: number) => void] {
  const [fraction, setFraction] = useState(startValue);

  function controlFraction(newFraction: number) {
    setFraction(getValueInRange(newFraction));
  }

  return [fraction, controlFraction];
}
