export function getOrCreateValue<K, V>(map: Map<K, V>, key: K, defaultValueCalculator: () => V): V {
  let value = map.get(key);

  if (value === undefined) {
    value = defaultValueCalculator();
    map.set(key, value);
  }

  return value;
}
