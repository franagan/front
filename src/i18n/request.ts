import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Idiomas soportados por la aplicación
export const locales = ['es', 'en'] as const;

// Idioma por defecto (español)
export const defaultLocale = 'es' as const;

// Tipo para los locales soportados
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  // Validar que el locale solicitado está en la lista de soportados
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    // Cargar dinámicamente el archivo de traducciones correspondiente
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
