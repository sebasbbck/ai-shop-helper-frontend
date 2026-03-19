import { useState, useCallback } from 'react'
import { useBoolean } from 'minimal-shared/hooks'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import ButtonBase from '@mui/material/ButtonBase'

import {
  PlanFreeIcon,
  PlanStarterIcon,
  PlanPremiumIcon,
} from '../../../assets/icons'

import { Label } from '../../../components/label'
import { Iconify } from '../../../components/iconify'

import { AddressListDialog } from './AddressListDialog'
import { PaymentCardListDialog } from './PaymentCardListDialog'
import { useTranslation } from 'next-i18next'
import PlanEnterpriseIcon from '../../../assets/icons/plan-enterprise-icon'

// ----------------------------------------------------------------------

interface SubscriptionPlanProps {
  cardList: Array<{
    id: string | number
    cardType: string
    cardNumber: string
    // cardHolder: string
    // expiryDate: string
    primary: boolean
  }>
  addressBook: Array<{
    id: string | number
    name: string
    addressType: string
    fullAddress: string
    phoneNumber: string
    primary: boolean
    // company: string,
    // email: string
  }>
  plans: Array<{
    subscription: string
    price?: number
    primary: boolean
  }>
}

export function SubscriptionPlan({
  cardList,
  addressBook,
  plans,
}: SubscriptionPlanProps) {
  const openAddress = useBoolean()
  const openCards = useBoolean()
  const { t } = useTranslation()

  const primaryCard = cardList.find((card) => card.primary) || null
  const primaryAddress = addressBook.find((address) => address.primary) || null

  const [selectedPlan, setSelectedPlan] = useState('')
  const [selectedCard, setSelectedCard] = useState(primaryCard)
  const [selectedAddress, setSelectedAddress] = useState(primaryAddress)

  const handleSelectPlan = useCallback(
    (newValue: any) => {
      const currentPlan = plans.find((plan) => plan.primary)
      if (currentPlan?.subscription !== newValue) {
        setSelectedPlan(newValue)
      }
    },
    [plans],
  )

  const handleSelectAddress = useCallback((newValue: any) => {
    setSelectedAddress(newValue)
  }, [])

  const handleSelectCard = useCallback((newValue: any) => {
    setSelectedCard(newValue)
  }, [])

  const renderPlans = () =>
    plans.map((plan) => (
      <Grid key={plan.subscription} size={{ xs: 6, md: 3 }}>
        <Paper
          variant="outlined"
          onClick={() => handleSelectPlan(plan.subscription)}
          sx={[
            (theme) => ({
              p: 2.5,
              borderRadius: 1.5,
              cursor: 'pointer',
              position: 'relative',
              ...(plan.primary && { opacity: 0.48, cursor: 'default' }),
              ...(plan.subscription === selectedPlan && {
                boxShadow: `0 0 0 2px ${theme.vars.palette.text.primary}`,
              }),
            }),
          ]}
        >
          {plan.primary && (
            <Label
              color="info"
              startIcon={<Iconify icon="eva:star-fill" />}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              {t('translation:settings.billing.current')}
            </Label>
          )}

          {plan.subscription === 'starter' && <PlanFreeIcon />}
          {plan.subscription === 'pro' && <PlanStarterIcon />}
          {plan.subscription === 'business' && <PlanPremiumIcon />}
          {plan.subscription === 'enterprise' && <PlanEnterpriseIcon />}

          <Box
            sx={{
              typography: 'subtitle2',
              mt: 2,
              mb: 0.5,
              textTransform: 'capitalize',
            }}
          >
            {plan.subscription}
          </Box>

          <Box sx={{ display: 'flex', typography: 'h4', alignItems: 'center' }}>
            {plan.price || t('translation:settings.billing.free')}

            {!!plan.price && (
              <Box
                component="span"
                sx={{ typography: 'body2', color: 'text.disabled', ml: 0.5 }}
              >
                {'€' + t('translation:settings.billing./month')}
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>
    ))

  const renderDetails = () => (
    <Box
      sx={{
        px: 3,
        pb: 3,
        gap: 2,
        display: 'flex',
        typography: 'body2',
        flexDirection: 'column',
      }}
    >
      {[
        {
          name: t('translation:settings.billing.plan'),
          content: (
            <Box component="span" sx={{ textTransform: 'capitalize' }}>
              {selectedPlan}
            </Box>
          ),
        },
        {
          name: t('translation:settings.billing.billing_name'),
          content: (
            <ButtonBase
              disableRipple
              onClick={openAddress.onTrue}
              sx={{ gap: 1, typography: 'subtitle2' }}
            >
              {selectedAddress?.name}
              <Iconify width={16} icon="eva:arrow-ios-downward-fill" />
            </ButtonBase>
          ),
        },
        {
          name: t('translation:settings.billing.billing_address'),
          content: selectedAddress?.fullAddress,
        },
        {
          name: t('translation:settings.billing.billing_phone_number'),
          content: selectedAddress?.phoneNumber,
        },
        {
          name: t('translation:settings.billing.payment_method'),
          content: (
            <ButtonBase
              disableRipple
              onClick={openAddress.onTrue}
              sx={{ gap: 1, typography: 'subtitle2' }}
            >
              {selectedCard?.cardNumber}
              <Iconify width={16} icon="eva:arrow-ios-downward-fill" />
            </ButtonBase>
          ),
        },
      ].map((item: any) => (
        <Grid key={item.name} container spacing={{ xs: 0.5, md: 2 }}>
          <Grid sx={{ color: 'text.secondary' }} size={{ xs: 12, md: 4 }}>
            {item.name}
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>{item.content || '-'}</Grid>
        </Grid>
      ))}
    </Box>
  )

  const renderFooter = () => (
    <Box
      sx={(theme) => ({
        p: 3,
        gap: 1.5,
        display: 'flex',
        justifyContent: 'flex-end',
        borderTop: `dashed 1px ${theme.vars.palette.divider}`,
      })}
    >
      <Button variant="outlined">
        {t('translation:settings.billing.cancel_plan')}
      </Button>
      <Button variant="contained">
        {t('translation:settings.billing.upgrade_plan')}
      </Button>
    </Box>
  )

  const renderCardListDialog = () => (
    <PaymentCardListDialog
      list={cardList}
      open={openCards.value}
      onClose={openCards.onFalse}
      selected={(selectedId: string | number) =>
        selectedCard?.id === selectedId
      }
      onSelect={handleSelectCard}
      action={
        <Button size="small" startIcon={<Iconify icon="mingcute:add-line" />}>
          Add
        </Button>
      }
      sx={undefined}
    />
  )

  const renderAddressListDialog = () => (
    <AddressListDialog
      list={addressBook}
      open={openAddress.value}
      onClose={openAddress.onFalse}
      selected={(selectedId) => selectedAddress?.id === selectedId}
      onSelect={handleSelectAddress}
      action={
        <Button size="small" startIcon={<Iconify icon="mingcute:add-line" />}>
          Add
        </Button>
      }
    />
  )

  return (
    <>
      <Card>
        <CardHeader title="Plan" />
        <Grid container spacing={2} sx={{ p: 3 }}>
          {renderPlans()}
        </Grid>
        {renderDetails()}
        {renderFooter()}
      </Card>

      {renderCardListDialog()}
      {renderAddressListDialog()}
    </>
  )
}
