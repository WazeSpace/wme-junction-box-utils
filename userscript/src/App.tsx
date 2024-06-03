import {
  BackgroundActions
} from '@/components/background-actions/BackgroundActions';
import { EditPanel } from '@/components/edit-panel/EditPanel';
import { InstructionsApplicationTemplate } from '@/components/edit-panel/instructions-application';
import { RoundaboutPerimeterPolygonTemplate } from '@/components/edit-panel/roundabout-perimeter-geometry/template';
import { SelectedDataModelsContextProvider } from '@/contexts/SelectedDataModelsContext';
import { Preferences } from './components/preferences/Preferences';
import { useInjectTranslations, usePreference } from './hooks';
import FallbackUserscriptTranslations from './resources/localization/userscript.json';
import { LanguageTranslations } from './@waze/I18n';
import { BigJunctionBackupTemplate } from './components/edit-panel/big-junction-backup';

interface AppProps {
  translations: LanguageTranslations;
}
export function App(props: AppProps) {
  useInjectTranslations(props.translations ?? FallbackUserscriptTranslations);
  const [isMasterDisabled] = usePreference('master_disable');

  return (
    <SelectedDataModelsContextProvider>
      <Preferences />

      {!isMasterDisabled && (
        <>
          <EditPanel
            templates={[
              RoundaboutPerimeterPolygonTemplate,
              BigJunctionBackupTemplate,
              InstructionsApplicationTemplate,
            ]}
          />
          <BackgroundActions />
        </>
      )}
    </SelectedDataModelsContextProvider>
  );
}
App.displayName = `userscript(JunctionBoxUtils-${process.env.SCRIPT_ID})`;
