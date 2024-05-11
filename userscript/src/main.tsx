import 'reflect-metadata';
import ReactDOM from 'react-dom';
import { App } from './App';
import { migratePreferencesFromRoundaboutJB } from './legacy-migrator';
import axios from 'axios';
import { axiosGmXhrAdapter } from './tampermonkey/axios-gmxhr-adapter';
import { getWazeMapEditorWindow } from './utils/get-wme-window';
import { createCrowdinOtaClient } from './localization/crowdin-client';

export default async function bootstrap() {
  axios.defaults.adapter = axiosGmXhrAdapter;

  const currentLocale = getWazeMapEditorWindow().I18n.currentLocale();
  const translations = await createCrowdinOtaClient(
    process.env.CROWDIN_DISTRIBUTION_HASH,
  ).getStringsByLocale(currentLocale);

  migratePreferencesFromRoundaboutJB();
  ReactDOM.render(
    <App translations={{ [currentLocale]: translations }} />,
    document.createElement('div'),
  );
}
