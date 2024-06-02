import 'reflect-metadata';
import deepmerge from 'deepmerge';
import ReactDOM from 'react-dom';
import { App } from './App';
import { migratePreferencesFromRoundaboutJB } from './legacy-migrator';
import axios from 'axios';
import { axiosGmXhrAdapter } from './tampermonkey/axios-gmxhr-adapter';
import { getWazeMapEditorWindow } from './utils/get-wme-window';
import CrowdinOtaClient from './localization/crowdin-ota/ota-client';
import { addGoogleTagManagerToPage } from './google-analytics';
import fallbackTranslations from './resources/localization/userscript.json';

export default async function bootstrap() {
  axios.defaults.adapter = axiosGmXhrAdapter;

  const currentLocale = getWazeMapEditorWindow().I18n.currentLocale();
  const translations = await new CrowdinOtaClient(
    process.env.CROWDIN_DISTRIBUTION_HASH,
  ).getStringsByLocale(currentLocale);
  const mergedTranslations = deepmerge(fallbackTranslations, translations);

  addGoogleTagManagerToPage(process.env.G_MEASUREMENT_ID);
  migratePreferencesFromRoundaboutJB();
  ReactDOM.render(
    <App translations={{ [currentLocale]: mergedTranslations }} />,
    document.createElement('div'),
  );
}
