import { useEffect, useState } from 'react';
import { PreferencesList } from './PreferencesList';
import { PreferencesEntryCard } from './PreferencesEntryCard';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { usePreference } from '@/hooks';
import { createPortal } from 'react-dom';
import { PreferencesContent } from './PreferencesContent';

function getEditorPrefsElement() {
  return document.querySelector('#sidepanel-prefs.tab-pane .settings');
}

export function Preferences() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefsLocation] = usePreference('prefs_location');
  const [portal, setPortal] = useState<Element>(getEditorPrefsElement());

  useEffect(() => {
    if (prefsLocation === 'wme-prefs') {
      setPortal(getEditorPrefsElement());
      return () => {};
    }

    const W = getWazeMapEditorWindow().W;
    const scriptTab = W.userscripts.registerSidebarTab(process.env.SCRIPT_ID);
    scriptTab.tabLabel.innerText = 'JBU';
    setPortal(scriptTab.tabPane);

    return () => {
      W.userscripts.removeSidebarTab(process.env.SCRIPT_ID);
    };
  }, [prefsLocation]);

  return createPortal(
    <>
      {prefsLocation === 'wme-prefs' && (
        <PreferencesEntryCard onClick={setShowPreferences.bind(null, true)} />
      )}
      {showPreferences && prefsLocation === 'wme-prefs' && (
        <PreferencesList onClosed={setShowPreferences.bind(null, false)} />
      )}
      {prefsLocation === 'tab' && <PreferencesContent />}
    </>,
    portal,
  );
}
