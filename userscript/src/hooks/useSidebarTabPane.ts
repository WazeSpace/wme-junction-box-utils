import { wmeSdk } from '@/utils/wme-sdk';
import { useEffect, useState } from 'react';

type SidebarTabPaneType = 'select' | 'solve' | 'events' | 'drives' | 'areas' | 'settings';

const tabTypeToDomIdMap: Record<SidebarTabPaneType, string> = {
  select: 'edit-panel',
  solve: 'sidepanel-issue-tracker',
  events: 'sidepanel-mtes',
  drives: 'sidepanel-drives',
  areas: 'sidepanel-areas',
  settings: 'sidepanel-prefs',
}

function getMountedTabPane(tabType: SidebarTabPaneType): Element | null {
  const domId = tabTypeToDomIdMap[tabType];
  return document.getElementById(domId);
}

export function useSidebarTabPane(tabType: SidebarTabPaneType): Element | null {
  const [tabPane, setTabPane] = useState<Element | null>(() => getMountedTabPane(tabType));

  useEffect(() => {
    setTabPane(getMountedTabPane(tabType));
  }, [tabType]);

  useEffect(() => {
    const unsubscribe = wmeSdk.Events.on({
      eventName: 'wme-sidebar-tab-opened',
      eventHandler: (e: { tabType: string, tabElement: Element }) => {
        if (tabType !== e.tabType) return;
        setTabPane(e.tabElement);
      }
    });

    return () => {
      unsubscribe();
    }
  }, [tabType]);

  return tabPane;
}
