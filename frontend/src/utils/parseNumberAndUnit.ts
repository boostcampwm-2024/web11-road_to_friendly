export function parseNumberAndUnit(numberAndUnit: string | undefined): [number, string] {
  const regex = /([0-9\.]+)(.*)/;
  const matches = numberAndUnit?.match(regex);
  if (matches) {
    return [Number(matches[1]), matches[2]];
  }
  return [0, ''];
}
