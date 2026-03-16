const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es', 'fr', 'de', 'pt'],
  },
  localePath: path.resolve('./public/locales'),
  defaultNS: 'translation',
  ns: ['translation'],
}
