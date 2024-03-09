import { WazeMapEditorWindow } from '@/@waze/window';

export function getWazeMapEditorWindow(): WazeMapEditorWindow {
  if ('unsafeWindow' in window)
    return window.unsafeWindow as WazeMapEditorWindow;
  return window as any;
}
