import {
  PreferencesAction,
  setPreferenceActionReducer,
} from '@/preferences/actions';
import { Preferences } from '@/preferences/prefs-data';
import { Reducer } from 'react';

type PrefsReducer = Reducer<Preferences, PreferencesAction>;

const ACTION_TYPE_TO_REDUCER_MAP: Record<
  PreferencesAction['type'],
  PrefsReducer
> = {
  'set-preference': setPreferenceActionReducer,
};

function getActionReducerFromActionType(
  actionType: PreferencesAction['type'],
): PrefsReducer {
  if (!ACTION_TYPE_TO_REDUCER_MAP.hasOwnProperty(actionType))
    throw new Error(`Action type of "${actionType}" is not supported.`);

  return ACTION_TYPE_TO_REDUCER_MAP[actionType];
}

export function preferencesReducer(
  prevState: Preferences,
  action: PreferencesAction,
) {
  const reducer = getActionReducerFromActionType(action.type);
  return reducer(prevState, action);
}
