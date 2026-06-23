import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import fr from './locales/fr.json';
import en from './locales/en.json';

const i18n = new I18n({ fr, en });

i18n.locale = getLocales()[0]?.languageCode ?? 'fr';
i18n.enableFallback = true;
i18n.defaultLocale = 'fr';

export const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options);

export default i18n;
