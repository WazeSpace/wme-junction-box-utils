import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { WebpackInjector } from '@/webpack-injector';

function waitForEvent<N extends Node>(
  node: N,
  eventName: string,
  skip = false,
) {
  if (skip) return Promise.resolve();
  return new Promise((resolve) => {
    node.addEventListener(eventName, () => resolve(undefined), {
      once: true,
    });
  });
}

await waitForEvent(
  document,
  'wme-initialized',
  getWazeMapEditorWindow().W?.userscripts?.state?.isInitialized,
);

const webpackInjector = new WebpackInjector(
  getWazeMapEditorWindow().webpackChunkeditor,
  {
    allModulesProp: 'm',
  },
);

window.React = Object.values(
  webpackInjector.findModulesByProperties([
    '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
    'createElement',
    'createContext',
    'useState',
    'useEffect',
    'useContext',
    'useReducer',
    'useCallback',
    'useMemo',
    'useRef',
    'useImperativeHandle',
    'useLayoutEffect',
    'useDebugValue',
  ]),
)[0];

window.ReactDOM = Object.values(
  webpackInjector.findModulesByProperties([
    '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
    'render',
    'hydrate',
    'unmountComponentAtNode',
    'findDOMNode',
    'createPortal',
  ]),
)[0];

import('./main').then(({ default: bootstrap }) => bootstrap());
