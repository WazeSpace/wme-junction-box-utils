import type {} from 'wme-sdk-typings';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

await getWazeMapEditorWindow().SDK_INITIALIZED;

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

import('./main').then(({ default: bootstrap }) => bootstrap());
