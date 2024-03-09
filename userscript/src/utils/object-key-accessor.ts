import { FlattenKeys, GetNestedType } from '@/utils/nested-object-keys';

const KEY_DELIMITER = '.';

export function getObjectItemByNestedKey<
  T extends object,
  K extends FlattenKeys<T>,
>(obj: T, key: K): GetNestedType<T, K> {
  const keyComponents = key.split(KEY_DELIMITER);

  return keyComponents.reduce((nestedObj, keyComponent) => {
    if (!nestedObj || !nestedObj.hasOwnProperty(keyComponent)) {
      return undefined;
    }

    return nestedObj[keyComponent];
  }, obj);
}

export function setObjectItemByNestedKey<T extends object>(
  obj: T,
  key: string,
  value: any,
): T {
  const keyComponents = key.split(KEY_DELIMITER);

  // Clone the object so keep the original object immutable
  obj = structuredClone(obj);

  keyComponents.reduce((acc, keyComponent, index, array) => {
    // Create nested object if it doesn't exist
    acc[keyComponent] = acc[keyComponent] || {};

    // If it's the last component, set the value
    if (index === array.length - 1) {
      acc[keyComponent] = value;
    }

    return acc[keyComponent];
  }, obj);

  return obj;
}
