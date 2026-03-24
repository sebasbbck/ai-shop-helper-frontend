import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../../lib/get-static-translations'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import AdminAgentsPage from '../../src/features/admin/components/AdminAgentsPage'
import { useRouter } from 'next/router'
import Agent from '../../src/features/agents/components/Agent'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function AgentPage() {
  const router = useRouter()
  const { id, projectTypeId } = router.query

  // Ensure we have the IDs before rendering the Agent component
  if (!id || !projectTypeId) {
    return null
  }

  return (
    <DashboardLayout>
      <Agent agentId={id as string} projectTypeId={projectTypeId as string} />
    </DashboardLayout>
  )
}
