import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../../lib/get-static-translations'
import { SimpleLayout } from '../../src/components/layouts/simple/layout'
import { ConnectionFailure } from '../../src/features/connections/components/ConnectionFailure'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function ConnectionFailurePage() {
  const { t } = useTranslation('translation')

  return (
    <SimpleLayout
      slotProps={{
        content: { compact: true },
      }}
    >
      <ConnectionFailure />
    </SimpleLayout>
  )
}
