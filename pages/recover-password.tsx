import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { SimpleLayout } from '../src/components/layouts/simple';
import RecoverPasswordForm from '../src/features/auth/components/RecoverPasswordForm';

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  };
}

export default function RecoverPassword() {
  const { t } = useTranslation('translation');

  return (
    <SimpleLayout>
      <RecoverPasswordForm />
    </SimpleLayout>
  )
}