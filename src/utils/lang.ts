export function getBrowserLang() {
  const lang = navigator.language.split('-')[0] // 'en-US' -> 'en'
  const supportedLangs = ['en', 'es', 'fr', 'de', 'pt']
  return supportedLangs.includes(lang) ? lang : 'en' // fallback to 'en'
}
