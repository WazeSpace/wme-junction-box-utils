import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

export function useTranslate(prefix?: string) {
  const { I18n } = getWazeMapEditorWindow();
  const constructFullKey = (key: string) => {
    if (prefix) return `${prefix}.${key}`;
    return key;
  };
  const translate = (key: string) => I18n.t(constructFullKey(key));
  return translate;
}
