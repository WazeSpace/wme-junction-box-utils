import { createPortal } from 'react-dom';
import { Preferences } from './components/preferences/Preferences';
import { useInjectTranslations } from './hooks';
import { translations } from './resources/localization';

export function App() {
  useInjectTranslations(translations);

  return (
    <>
      {createPortal(
        <Preferences />,
        document.querySelector('#sidepanel-prefs.tab-pane .settings'),
      )}
    </>
  );
}
App.displayName = `userscript(JunctionBoxUtils-${process.env.SCRIPT_ID})`;
