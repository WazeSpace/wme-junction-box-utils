export function distinctArray<T, K>(
  array: T[],
  keyGenerator: (item: T) => K,
): T[] {
  const arrayAsKeyValuePairs = array.map(
    (item) => [keyGenerator(item), item] as const,
  );
  const map = new Map(arrayAsKeyValuePairs);
  return Array.from(map.values());
}

export function groupArrayBy<T, K>(
  array: T[],
  keyOrExtractorFn: K | ((item: T) => K),
): Map<K, T[]> {
  const keyExtractorFn =
    typeof keyOrExtractorFn === 'function'
      ? (keyOrExtractorFn as (item: T) => K)
      : (item: T) => item[keyOrExtractorFn as any] as K;

  const map = new Map<K, T[]>();

  const createEmptyArrayWithKeyLink = (key: K) => {
    const emptyArray: T[] = [];
    emptyArray.push = function (...items: T[]) {
      const newLength = Array.prototype.push.apply(this, items);
      if (newLength > 0) map.set(key, this);
      return newLength;
    };
    return emptyArray;
  };
  const getArrayByKey = (key: K) => {
    if (map.has(key)) return map.get(key);
    return createEmptyArrayWithKeyLink(key);
  };

  array.forEach((item) => {
    const key = keyExtractorFn(item);
    getArrayByKey(key).push(item);
  });

  return map;
}

export function compareArrays<T, C>(
  array1: ReadonlyArray<T>,
  array2: ReadonlyArray<T>,
  valueExtractor: (item: T) => C,
) {
  if (array1.length !== array2.length) return false;

  const testArray = array1.map(valueExtractor);
  const subjectArray = array2.map(valueExtractor);

  for (const testItem of testArray) {
    const itemIndexInSubject = subjectArray.indexOf(testItem);
    // if this item was not found in the array, then return false
    if (itemIndexInSubject === -1) return false;

    // remove the item from the subject for multi-occurance items
    subjectArray.splice(itemIndexInSubject, 1);
  }

  return true;
}
