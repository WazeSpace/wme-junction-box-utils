import ReactDOM from 'react-dom';
import { createElement } from 'react';
import { App } from './App';

export default async function bootstrap() {
  ReactDOM.render(createElement(App), document.createElement('div'));
}
