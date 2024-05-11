import 'reflect-metadata';
import ReactDOM from 'react-dom';
import { createElement } from 'react';
import { App } from './App';
import { migratePreferencesFromRoundaboutJB } from './legacy-migrator';
import axios from 'axios';
import { axiosGmXhrAdapter } from './tampermonkey/axios-gmxhr-adapter';

export default async function bootstrap() {
  axios.defaults.adapter = axiosGmXhrAdapter;
  migratePreferencesFromRoundaboutJB();
  ReactDOM.render(createElement(App), document.createElement('div'));
}
