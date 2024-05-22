import 'reflect-metadata';
import ReactDOM from 'react-dom';
import { App } from './App';
import { migratePreferencesFromRoundaboutJB } from './legacy-migrator';
import axios from 'axios';
import { axiosGmXhrAdapter } from './tampermonkey/axios-gmxhr-adapter';
import { getWazeMapEditorWindow } from './utils/get-wme-window';
import CrowdinOtaClient from './localization/crowdin-ota/ota-client';
import { addGoogleTagManagerToPage } from './google-analytics';

export default async function bootstrap() {
  axios.defaults.adapter = axiosGmXhrAdapter;

  const currentLocale = getWazeMapEditorWindow().I18n.currentLocale();
  const translations = await new CrowdinOtaClient(
    process.env.CROWDIN_DISTRIBUTION_HASH,
  ).getStringsByLocale(currentLocale);

  addGoogleTagManagerToPage(process.env.G_MEASUREMENT_ID);
  migratePreferencesFromRoundaboutJB();
  ReactDOM.render(
    <App translations={{ [currentLocale]: translations }} />,
    document.createElement('div'),
  );
}
