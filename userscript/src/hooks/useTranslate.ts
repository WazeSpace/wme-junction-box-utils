import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

export function useTranslate() {
  const { I18n } = getWazeMapEditorWindow();
  return I18n.t;
}
