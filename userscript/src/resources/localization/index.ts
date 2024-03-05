import en from './en.json';

export const translations = { en };

const availableLocales = new Set(Object.keys(translations));
const defaultLocale: keyof typeof translations = 'en';

function getDialectsFromSpecificToUnspecific(locale: string): readonly string[] {
  const variants = new Set<string>();
  while (locale) {
    variants.add(locale);
    const hyphenIndex = locale.lastIndexOf('-');
    if (hyphenIndex === -1) break;
    locale = locale.substring(0, hyphenIndex);
  }

  return Array.from(variants);
}
export function getBestSuitableLocale(locale: string) {
  const localeVariants = getDialectsFromSpecificToUnspecific(locale);
  for (const localeVariant of localeVariants) {
    if (availableLocales.has(localeVariant)) {
      return localeVariant;
    }
  }

  return defaultLocale;
}
