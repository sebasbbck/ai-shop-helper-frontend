const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['minimal-shared'],
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es', 'fr', 'de', 'pt'],
  },
  output: 'standalone',
}
