import {
  defaultPreferences,
  Preferences,
  PREFERENCES_LS_KEY,
  preferencesReducer,
} from '@/preferences';
import {
  createSetPreferenceAction,
  PreferencesAction,
} from '@/preferences/actions';
import {
  FlattenKeys,
  GetNestedType,
  getObjectItemByNestedKey,
  mergeDeep,
} from '@/utils';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export function usePreferences() {
  const [prefs, setRawPrefs] = useLocalStorage(
    PREFERENCES_LS_KEY,
    defaultPreferences,
    {
      serializer(value) {
        return JSON.stringify(value);
      },
      deserializer(rawValue) {
        const value = JSON.parse(rawValue);
        return mergeDeep(
          structuredClone(defaultPreferences),
          value,
        ) as Preferences;
      },
    },
  );

  const reducer = (action: PreferencesAction) => {
    setRawPrefs((prevState) => preferencesReducer(prevState, action));
  };

  return [prefs, reducer] as const;
}

export function usePreference<K extends FlattenKeys<Preferences>>(key: K) {
  const [preferences, dispatch] = usePreferences();

  const preferenceValue = useMemo(() => {
    return getObjectItemByNestedKey(preferences, key);
  }, [preferences, key]);
  const setPreferenceValue: Dispatch<
    SetStateAction<GetNestedType<Preferences, K>>
  > = (setStateAction) => {
    return dispatch(createSetPreferenceAction(key, setStateAction));
  };

  return [preferenceValue, setPreferenceValue] as const;
}

export function useSetPreference<K extends FlattenKeys<Preferences>>(
  key: K,
  defaultValue: SetStateAction<GetNestedType<Preferences, K>>,
) {
  const [, dispatch] = usePreferences();
  const setPreferenceValue = (
    value?: SetStateAction<GetNestedType<Preferences, K>>,
  ): void => {
    dispatch(createSetPreferenceAction(key, value || defaultValue));
  };
  return setPreferenceValue;
}
