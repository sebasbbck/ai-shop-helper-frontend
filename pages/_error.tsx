import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../lib/get-static-translations'
import Inbox from '../src/features/notifications/components/Inbox'
import { NotFound } from '../src/features/errors/components/404'
import { SimpleLayout } from '../src/components/layouts/simple/layout'
import { GeneralError } from '../src/features/errors/components/GeneralError'

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function Error({ statusCode }) {
  const { t } = useTranslation('translation')

  return (
    <SimpleLayout
      slotProps={{
        content: { compact: true },
      }}
    >
      <GeneralError statusCode={statusCode} />
    </SimpleLayout>
  )
}
