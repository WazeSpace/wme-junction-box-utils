import { useEffect, useState } from 'react';
import { PreferencesList } from './PreferencesList';
import { PreferencesEntryCard } from './PreferencesEntryCard';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { usePreference, useSidebarTabPane } from '@/hooks';
import { createPortal } from 'react-dom';
import { PreferencesContent } from './PreferencesContent';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { useMemo } from 'react';

export function Preferences() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefsLocation] = usePreference('prefs_location');
  const prefsSidebarTabPane = useSidebarTabPane('settings');
  const [scriptTabPane, setScriptTabPane] = useState<Element | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefsLocation !== 'tab') return;

    const W = getWazeMapEditorWindow().W;
    const scriptTab = W.userscripts.registerSidebarTab(process.env.SCRIPT_ID);
    scriptTab.tabLabel.innerText = 'JBU';
    setScriptTabPane(scriptTab.tabPane);

    let clickCount = 0;
    let clickTimeout: ReturnType<typeof setTimeout>;

    const handleTabClick = (e: MouseEvent) => {
      clickCount++;
      if (clickCount >= 5) {
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setContextMenuVisible(true);
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

  const virtualReference = useMemo(() => ({
    getBoundingClientRect() {
      return {
        top: contextMenuPosition.y,
        left: contextMenuPosition.x,
        bottom: contextMenuPosition.y,
        right: contextMenuPosition.x,
        width: 0,
        height: 0,
      };
    },
  }), [contextMenuPosition]);

  return targetElement ? createPortal(
    <>
      <Tippy
        visible={contextMenuVisible}
        onClickOutside={() => setContextMenuVisible(false)}
        interactive
        animation="scale"
        placement="bottom-start"
        reference={virtualReference as any}
        getReferenceClientRect={() => virtualReference.getBoundingClientRect()}
        content={
          <div
            className="wme-closures-context-menu"
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--background_default, #fff)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
              padding: '4px',
              minWidth: '150px',
              border: '1px solid var(--border_subtle, #e8eaed)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: '4px',
                color: 'var(--content_default, #202124)',
                fontSize: '14px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background_hover, #f1f3f4)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => {
                import('@/logger').then(({ Logger }) => {
                  Logger.info('Log download triggered by 5 clicks on script tab');
                  Logger.downloadLogs();
                });
                setContextMenuVisible(false);
              }}
            >
              <i className="w-icon w-icon-download" style={{ fontSize: '16px' }} />
              <span>Download Logs</span>
            </div>
          </div>
        }
      />
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
