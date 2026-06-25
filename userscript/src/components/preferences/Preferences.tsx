import { useEffect, useState } from 'react';
import { PreferencesList } from './PreferencesList';
import { PreferencesEntryCard } from './PreferencesEntryCard';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { usePreference, useSidebarTabPane } from '@/hooks';
import { createPortal } from 'react-dom';
import { PreferencesContent } from './PreferencesContent';

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
    let clickTimeout: ReturnType<typeof setTimeout>;

    const handleTabClick = async (e: MouseEvent) => {
      clickCount++;
      if (clickCount >= 5) {
        const { getOrCreateDebugMenu } = await import('./debug-menu');
        const menu = getOrCreateDebugMenu() as any;

        import('@/logger').then(({ Logger }) => {
          Logger.info('Log download menu triggered by 5 clicks on script tab');
        });

        // showMenu expects a native MouseEvent which e provides since it's an addeventlistener callback
        menu.showMenu(e);

        clickCount = 0;
        clearTimeout(clickTimeout);
      } else {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
          clickCount = 0;
        }, 500);
      }
    };

    scriptTab.tabLabel.addEventListener('click', handleTabClick);

    return () => {
      scriptTab.tabLabel.removeEventListener('click', handleTabClick);
      W.userscripts.removeSidebarTab(process.env.SCRIPT_ID);
      setScriptTabPane(null);
    };
  }, [prefsLocation])

  const targetElement = (() => {
    switch (prefsLocation) {
      case 'wme-prefs': return prefsSidebarTabPane;
      case 'tab': return scriptTabPane;
    }
  })();

  return targetElement ? createPortal(
    <>
      {prefsLocation === 'wme-prefs' && (
        <PreferencesEntryCard onClick={setShowPreferences.bind(null, true)} />
      )}
      {showPreferences && prefsLocation === 'wme-prefs' && (
        <PreferencesList onClosed={setShowPreferences.bind(null, false)} />
      )}
      {prefsLocation === 'tab' && <PreferencesContent />}
    </>,
    targetElement,
  ) : null;
}
