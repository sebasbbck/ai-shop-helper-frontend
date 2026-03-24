import Grid from '@mui/material/Grid'

import { SubscriptionPlan } from '../../billing/components/SubscriptionPlan'
import { Payment } from '../../billing/components/Payment'
import { PaymentHistory } from '../../billing/components/PaymentHistory'
import { BillingAddress } from '../../billing/components/BillingAddress'
import { Alert } from '@mui/material'

import { useTranslation } from 'next-i18next'

// ----------------------------------------------------------------------

interface SettingsBillingProps {
  cards: Array<{
    id: string | number
    cardType: string
    cardNumber: string

    primary: boolean
  }>
  addressBook: Array<{
    id: string | number
    name: string
    addressType: string
    fullAddress: string
    phoneNumber: string
    primary: boolean
  }>
  plans: Array<{
    subscription: string
    price?: number
    primary: boolean
  }>
  invoices: Array<{
    id: string | number
    invoiceNumber: string
    createdAt: string | number | Date
    price: string | number
  }>
}

export function SettingsBilling() {
  const { t } = useTranslation()

  // Mock data
  const plans = [
    { subscription: 'starter', price: 0, primary: true },
    { subscription: 'pro', price: 20, primary: false },
    { subscription: 'business', price: 50, primary: false },
    { subscription: 'enterprise', price: 120, primary: false },
  ]

  const cards = [
    {
      id: 1,
      cardNumber: '**** **** **** 1234',
      cardType: 'visa',
      primary: true,
    },
  ]

  const addressBook = [
    {
      id: 1,
      name: 'Álvaro Álvarez',
      addressType: 'Home',
      fullAddress:
        'Calle Pino Siberia, 1, Polígono Industrial El Pino, 41015 Sevilla',
      phoneNumber: '612345678',
      primary: true,
    },
  ]

  const invoices = [
    { id: 1, invoiceNumber: 'R-0001', createdAt: '1/1/2026', price: '50,00€' },
    { id: 2, invoiceNumber: 'R-0002', createdAt: '1/2/2026', price: '15,00€' },
  ]

  // const { currentProject } = useCurrentProject()
  return (
    <Grid container spacing={5}>
      <Grid size={12}>
        <Alert severity="info">Esta es una funcionalidad en desarrollo.</Alert>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <SubscriptionPlan
          plans={plans}
          cardList={cards}
          addressBook={addressBook}
        />
        <Payment cards={cards} />
        <BillingAddress addressBook={addressBook} />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <PaymentHistory invoices={invoices} />
      </Grid>
    </Grid>
  )
}
