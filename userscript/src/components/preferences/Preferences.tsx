import { useState } from 'react';
import { PreferencesList } from './PreferencesList';
import { PreferencesEntryCard } from './PreferencesEntryCard';

export function Preferences() {
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <>
      <PreferencesEntryCard onClick={setShowPreferences.bind(null, true)} />
      {showPreferences && <PreferencesList onClosed={setShowPreferences.bind(null, false)} />}
    </>
  );
}
