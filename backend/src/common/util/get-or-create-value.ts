export function getOrCreateValue<K, V>(
  container: Map<K, V>,
  key: K,
  defaultValueCalculator: () => V
): V;

export function getOrCreateValue<K extends PropertyKey, V>(
  container: Record<K, V>,
  key: K,
  defaultValueCalculator: () => V
): V;

export function getOrCreateValue<K, V>(
  container: Map<K, V> | Record<PropertyKey & K, V>,
  key: K,
  defaultValueCalculator: () => V
): V {
  if (container instanceof Map) {
    let value = container.get(key);

    if (value === undefined) {
      value = defaultValueCalculator();
      container.set(key, value);
    }

    return value;
  } else {
    let value = container[key as PropertyKey & K];

    if (value === undefined) {
      value = defaultValueCalculator();
      container[key as PropertyKey & K] = value;
    }

    return value;
  }
}
