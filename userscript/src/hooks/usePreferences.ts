import { defaultPreferences, Preferences, preferencesReducer } from '@/preferences';
import { createSetPreferenceAction, PreferencesAction } from '@/preferences/actions';
import { FlattenKeys, GetNestedType, getObjectItemByNestedKey } from '@/utils';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export function usePreferences() {
  const [prefs, setRawPrefs] = useLocalStorage('r0den.userscripts.jbu.prefs', defaultPreferences);

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
  const setPreferenceValue: Dispatch<SetStateAction<GetNestedType<Preferences, K>>> = (setStateAction) => {
    return dispatch(createSetPreferenceAction(key, setStateAction));
  };

  return [preferenceValue, setPreferenceValue] as const;
}
