import {
  BackgroundActions
} from '@/components/background-actions/BackgroundActions';
import { BigJunctionPropsBackupTemplate } from '@/components/edit-panel/big-junction-props-backup/template';
import { EditPanel } from '@/components/edit-panel/EditPanel';
import { RoundaboutExitInstructionNormalizationTemplate } from '@/components/edit-panel/roundabout-exit-instruction-normalization/template';
import { RoundaboutPerimeterPolygonTemplate } from '@/components/edit-panel/roundabout-perimeter-geometry/template';
import { SelectedDataModelsContextProvider } from '@/contexts/SelectedDataModelsContext';
import { Preferences } from './components/preferences/Preferences';
import { useInjectTranslations, usePreference } from './hooks';
import { translations } from './resources/localization';
import { LanguageTranslations } from './@waze/I18n';

interface AppProps {
  translations: LanguageTranslations;
}
export function App(props: AppProps) {
  useInjectTranslations(props.translations ?? translations);
  const [isMasterDisabled] = usePreference('master_disable');

  return (
    <SelectedDataModelsContextProvider>
      <Preferences />

      {!isMasterDisabled && (
        <>
          <EditPanel
            templates={[
              RoundaboutExitInstructionNormalizationTemplate,
              RoundaboutPerimeterPolygonTemplate,
              BigJunctionPropsBackupTemplate,
            ]}
          />
          <BackgroundActions />
        </>
      )}
    </SelectedDataModelsContextProvider>
  );
}
App.displayName = `userscript(JunctionBoxUtils-${process.env.SCRIPT_ID})`;
