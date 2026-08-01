import { useEffect, useState } from 'react';
import { PreferencesList } from './PreferencesList';
import { PreferencesEntryCard } from './PreferencesEntryCard';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { usePreference, useSidebarTabPane } from '@/hooks';
import { createPortal } from 'react-dom';
import { PreferencesContent } from './PreferencesContent';
import { showDebugMenu } from '@/utils/debug-menu';

export function Preferences() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefsLocation] = usePreference('prefs_location');
  const prefsSidebarTabPane = useSidebarTabPane('settings');
  const [scriptTabPane, setScriptTabPane] = useState<Element | null>(null);

  useEffect(() => {
    if (prefsLocation !== 'tab') return;

    const W = getWazeMapEditorWindow().W;
    const scriptTab = W.userscripts.registerSidebarTab(process.env.SCRIPT_ID);
    scriptTab.tabLabel.innerText = 'JBU';
    setScriptTabPane(scriptTab.tabPane);

    let clickCount = 0;
    let lastClickTime = 0;
    const CLICK_TIMEOUT = 3000;

    const handlePointerUp = (event: MouseEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastClickTime > CLICK_TIMEOUT) {
        clickCount = 0;
      }
      clickCount++;
      lastClickTime = currentTime;

      if (clickCount === 5) {
        clickCount = 0;
        showDebugMenu(event);
      }
    };

    const tabLabel = scriptTab.tabLabel;
    tabLabel.addEventListener('pointerup', handlePointerUp);

    return () => {
      tabLabel.removeEventListener('pointerup', handlePointerUp);
      W.userscripts.removeSidebarTab(process.env.SCRIPT_ID);
      setScriptTabPane(null);
    };
  }, [prefsLocation]);

  const targetElement = (() => {
    switch (prefsLocation) {
      case 'wme-prefs': return prefsSidebarTabPane;
      case 'tab': return scriptTabPane;
    }
  })();

  const handleContextMenu = (event: React.MouseEvent) => {
    showDebugMenu(event.nativeEvent);
  };

  return targetElement
    ? createPortal(
        <>
          {prefsLocation === 'wme-prefs' && (
            <PreferencesEntryCard
              onClick={setShowPreferences.bind(null, true)}
              onContextMenu={handleContextMenu}
            />
          )}
          {showPreferences && prefsLocation === 'wme-prefs' && (
            <PreferencesList onClosed={setShowPreferences.bind(null, false)} />
          )}
          {prefsLocation === 'tab' && <PreferencesContent />}
        </>,
        targetElement,
      )
    : null;
}
