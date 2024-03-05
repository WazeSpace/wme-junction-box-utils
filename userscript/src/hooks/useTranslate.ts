import { getWazeMapEditorWindow } from '@/@waze/window';

export function useTranslate() {
  const { I18n } = getWazeMapEditorWindow();
  return I18n.t;
}
