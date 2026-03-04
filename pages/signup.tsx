import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import SignUpForm from '../src/features/auth/components/SignUpForm';
import { SimpleLayout } from '../src/components/layouts/simple';

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  };
}

export default function Signup() {
  const { t } = useTranslation('translation');

  return (
    <SimpleLayout>
      <SignUpForm />
    </SimpleLayout>
  )
}