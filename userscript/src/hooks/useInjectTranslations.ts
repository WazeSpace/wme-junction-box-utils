import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { useMemo } from 'react';
import { Logger } from '@/logger';
import { getBestSuitableLocale } from '@/resources/localization';
import { useSyncEffect } from './useSyncEffect';
import { LanguageTranslations } from '@/@waze/I18n';

function addNonExistingTranslationKeys(
  destination: LanguageTranslations,
  additionalTranslations: LanguageTranslations,
  currentPath = '',
): readonly string[] {
  const appendedTranslationKeys = new Set<string>();

  for (const translationsKey in additionalTranslations) {
    if (destination.hasOwnProperty(translationsKey)) {
      const value = destination[translationsKey];
      const additionalTransValue = additionalTranslations[translationsKey];

      if (
        typeof value !== 'object' ||
        typeof additionalTransValue !== 'object'
      ) {
        Logger.warn(
          `WazeMapEditor already has the translation key "${currentPath}${translationsKey}", skipping...`,
        );
        continue;
      }

      addNonExistingTranslationKeys(
        value,
        additionalTransValue,
        `${currentPath}${translationsKey}.`,
      );
      continue;
    }

    destination[translationsKey] = additionalTranslations[translationsKey];
    appendedTranslationKeys.add(translationsKey);
  }

  return Array.from(appendedTranslationKeys);
}

function removeTranslationsByKeys(
  translationsObject: LanguageTranslations,
  translationKeys: readonly string[],
) {
  for (const translationKey of translationKeys) {
    if (translationsObject.hasOwnProperty(translationKey))
      delete translationsObject[translationKey];
  }
}

export function useInjectTranslations(
  translationsToInject: LanguageTranslations,
) {
  useSyncEffect(() => {
    const { I18n } = getWazeMapEditorWindow();
    const wmeTranslations = I18n.translations[
      I18n.locale
    ] as LanguageTranslations;

    const appendedTranslationKeys = addNonExistingTranslationKeys(
      wmeTranslations,
      translationsToInject[I18n.currentLocale()] as LanguageTranslations,
    );

    return () => {
      removeTranslationsByKeys(wmeTranslations, appendedTranslationKeys);
    };
  }, [translationsToInject]);
}
