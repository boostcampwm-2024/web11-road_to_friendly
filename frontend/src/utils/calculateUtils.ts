export function parseNumberAndUnit(numberAndUnit: string | undefined): [number, string] {
  const regex = /([0-9\.]+)(.*)/;
  const matches = numberAndUnit?.match(regex);
  if (matches) {
    return [Number(matches[1]), matches[2]];
  }
  return [0, ''];
}

export function divideSize(size: string, divisor: number) {
  const [number, unit] = parseNumberAndUnit(size);
  return `${(number / divisor).toFixed(3)}${unit}`;
}

export function multiplySize(size: string, multiplier: number) {
  const [number, unit] = parseNumberAndUnit(size);
  return `${(number * multiplier).toFixed(3)}${unit}`;
}
