import 'reflect-metadata';
import ReactDOM from 'react-dom';
import { createElement } from 'react';
import { App } from './App';
import { migratePreferencesFromRoundaboutJB } from './legacy-migrator';

export default async function bootstrap() {
  migratePreferencesFromRoundaboutJB();
  ReactDOM.render(createElement(App), document.createElement('div'));
}
