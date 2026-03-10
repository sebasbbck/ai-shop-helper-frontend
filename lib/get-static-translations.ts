import path from 'path'
import fs from 'fs'

export async function getStaticTranslations(locale: string) {
  try {
    const localesPath = path.join(process.cwd(), 'public/locales', locale)
    const translationFile = path.join(localesPath, 'translation.json')

    let translations = {}

    if (fs.existsSync(translationFile)) {
      const content = fs.readFileSync(translationFile, 'utf-8')
      translations = JSON.parse(content)
    }

    return {
      _nextI18Next: {
        initialI18nStore: {
          [locale]: {
            translation: translations,
          },
        },
        initialLanguage: locale,
      },
    }
  } catch (error) {
    console.warn('Error loading translations for locale:', locale, error)
    // Return the expected structure without translations
    return {
      _nextI18Next: {
        initialI18nStore: {
          [locale]: {
            translation: {},
          },
        },
        initialLanguage: locale,
      },
    }
  }
}
