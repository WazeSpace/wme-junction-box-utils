import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { useMemo } from 'react';
import { WazeMapEditorWindow } from '@/@waze/window';
import { Logger } from '@/logger';
import { getBestSuitableLocale } from '@/resources/localization';
import { useSyncEffect } from './useSyncEffect';

type WazeMapEditorTranslations = WazeMapEditorWindow['I18n']['translations'];

function addNonExistingTranslationKeys(
  destination: WazeMapEditorTranslations,
  additionalTranslations: WazeMapEditorTranslations,
): readonly string[] {
  const appendedTranslationKeys = new Set<string>();

  for (const translationsKey in additionalTranslations) {
    if (destination.hasOwnProperty(translationsKey)) {
      Logger.warn(`WazeMapEditor already has the translation key "${translationsKey}", skipping...`);
      continue;
    }

    destination[translationsKey] = additionalTranslations[translationsKey];
    appendedTranslationKeys.add(translationsKey);
  }

  return Array.from(appendedTranslationKeys);
}

function removeTranslationsByKeys(translationsObject: WazeMapEditorTranslations, translationKeys: readonly string[]) {
  for (const translationKey of translationKeys) {
    if (translationsObject.hasOwnProperty(translationKey)) delete translationsObject[translationKey];
  }
}

export function useInjectTranslations(translationsToInject: WazeMapEditorTranslations) {
  const localeToInject = useMemo(() => {
    const { I18n } = getWazeMapEditorWindow();
    return getBestSuitableLocale(I18n.locale);
  }, [translationsToInject]);

  useSyncEffect(() => {
    const { I18n } = getWazeMapEditorWindow();
    const wmeTranslations = I18n.translations[I18n.locale] as WazeMapEditorTranslations;

    const appendedTranslationKeys = addNonExistingTranslationKeys(
      wmeTranslations,
      translationsToInject[localeToInject] as WazeMapEditorTranslations,
    );

    return () => {
      removeTranslationsByKeys(wmeTranslations, appendedTranslationKeys);
    };
  }, [translationsToInject]);
}
