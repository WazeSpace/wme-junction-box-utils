import 'reflect-metadata';
import deepmerge from 'deepmerge';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { migratePreferencesFromRoundaboutJB } from './legacy-migrator';
import axios from 'axios';
import { axiosGmXhrAdapter } from './tampermonkey/axios-gmxhr-adapter';
import { getWazeMapEditorWindow } from './utils/get-wme-window';
import CrowdinOtaClient from './localization/crowdin-ota/ota-client';
import { addGoogleTagManagerToPage } from './google-analytics';
import fallbackTranslations from './resources/localization/userscript.json';
import { wmeSdk } from './utils/wme-sdk';

export default async function bootstrap() {
  axios.defaults.adapter = axiosGmXhrAdapter;

  // @ts-expect-error
  await initWmeSdkPlus(wmeSdk);

  const currentLocale = getWazeMapEditorWindow().I18n.currentLocale();
  const translations = await new CrowdinOtaClient(
    process.env.CROWDIN_DISTRIBUTION_HASH,
  ).getStringsByLocale(currentLocale);
  const mergedTranslations = deepmerge(fallbackTranslations, translations);

  addGoogleTagManagerToPage(process.env.G_MEASUREMENT_ID);
  migratePreferencesFromRoundaboutJB();

  const root = createRoot(document.createElement('div'));
  root.render(<App translations={{ [currentLocale]: mergedTranslations }} />);
}
