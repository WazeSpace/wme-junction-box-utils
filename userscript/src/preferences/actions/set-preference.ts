import { Preferences } from '@/preferences/prefs-data';
import { FlattenKeys, GetNestedType, setObjectItemByNestedKey } from '@/utils';
import { SetStateAction } from 'react';

export type SetPreferenceAction<Key extends FlattenKeys<Preferences> = FlattenKeys<Preferences>> = {
  type: 'set-preference';
  key: Key;
  value: SetStateAction<GetNestedType<Preferences, Key>>;
};

export function setPreferenceActionReducer(state: Preferences, action: SetPreferenceAction): Preferences {
  const newValue = typeof action.value === 'function' ? action.value(state[action.key]) : action.value;
  return setObjectItemByNestedKey(state, action.key, newValue);
}

export function createSetPreferenceAction<Key extends FlattenKeys<Preferences>>(
  key: Key,
  value: SetStateAction<GetNestedType<Preferences, Key>>,
): SetPreferenceAction<Key> {
  return {
    type: 'set-preference',
    key,
    value,
  };
}
