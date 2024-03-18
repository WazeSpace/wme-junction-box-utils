import { EditPanel } from '@/components/edit-panel/EditPanel';
import { RoundaboutExitInstructionNormalizationTemplate } from '@/components/edit-panel/roundabout-exit-instruction-normalization/template';
import { SelectedDataModelsContextProvider } from '@/contexts/SelectedDataModelsContext';
import { createPortal } from 'react-dom';
import { Preferences } from './components/preferences/Preferences';
import { useInjectTranslations } from './hooks';
import { translations } from './resources/localization';

export function App() {
  useInjectTranslations(translations);

  return (
    <SelectedDataModelsContextProvider>
      {createPortal(
        <Preferences />,
        document.querySelector('#sidepanel-prefs.tab-pane .settings'),
      )}

      <EditPanel templates={[RoundaboutExitInstructionNormalizationTemplate]} />
    </SelectedDataModelsContextProvider>
  );
}
App.displayName = `userscript(JunctionBoxUtils-${process.env.SCRIPT_ID})`;
