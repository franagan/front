import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n/request';

export default createMiddleware({
  // Lista de idiomas soportados
  locales,
  
  // Idioma por defecto
  defaultLocale,
  
  // Detectar automáticamente el idioma del navegador del usuario
  localeDetection: true,
  
  // Siempre mostrar el prefijo de idioma en la URL (/es, /en)
  // Esto es mejor para SEO y claridad
  localePrefix: 'always'
});

export const config = {
  // Aplicar el middleware a todas las rutas EXCEPTO:
  // - /api/* (rutas de API)
  // - /_next/* (archivos internos de Next.js)
  // - /_vercel/* (archivos de Vercel)
  // - Archivos estáticos (*.png, *.jpg, *.ico, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
