import { CONFIG } from '../../../global-config'

import Typography from '@mui/material/Typography'

import useAuth from '../../../hooks/useAuth'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'next-i18next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import { Iconify } from '../../../components/iconify'
import useCustomToast from '../../../hooks/useCustomToast'
import {
  Card,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  styled,
  SvgIcon,
  TextField,
} from '@mui/material'
import { Fragment, SetStateAction, useEffect, useState } from 'react'
import Menu from '@mui/material/Menu'
import { DashboardContent } from '../../../components/layouts/dashboard'
import { ReferralsHeader } from './ReferralsHeader'

// ----------------------------------------------------------------------

export interface MockUser {
  id: string
  email: string
  name: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
  // TODO: Remove mock data
  referral_code?: string
}

export default function Referrals() {
  const { user } = useAuth()

  // TODO: Remove mock data
  let mockUser: MockUser | null = null

  useEffect(() => {
    if (user) {
      mockUser = user
      mockUser.referral_code = 'TEST'
    }
  }, [user])

  const { showSuccessToast } = useCustomToast()
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const menuOpen = Boolean(anchorEl)

  const title = t('titles.referrals', '', { appName: CONFIG.appName })

  const handleMenuOpen = (e: { currentTarget: SetStateAction<null> }) =>
    setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleCopyCode = () => {
    const text = t('translation:referrals.share_message', '', {
      appName: CONFIG.appName,
      code: mockUser?.referral_code,
      credits: 100,
    })
    navigator.clipboard.writeText(text)
    showSuccessToast(t('translation:referrals.copy_success_toast'))
  }

  const handleShare = (platform: string) => {
    const signupUrl = `https://dapp.aishophelper.ai/signup?ref=${mockUser?.referral_code}`
    const text = t('translation:referrals.share_message', '', {
      appName: CONFIG.appName,
      code: mockUser?.referral_code,
      credits: 100,
    })
    let url = ''
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(signupUrl)}&quote=${encodeURIComponent(text)}`
    } else if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(text)}`
    } else if (platform === 'email') {
      const subject = t('translation:referrals.title', '', {
        appName: CONFIG.appName,
      })
      url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(signupUrl)}`
    } else if (platform === 'reddit') {
      url = `https://www.reddit.com/submit?url=${encodeURIComponent(signupUrl)}&title=${encodeURIComponent(text)}`
    }
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
    handleMenuClose()
  }

  // TODO: replace mock data with real referred users
  const referrals = [
    { name: 'Andrés P.', status: 'Liberado' as const },
    {
      name: 'Tienda Online SL',
      status: 'Pendiente' as const,
      sub: t('translation:referrals.real_action_required'),
    },
    { name: 'Marta J.', status: 'Liberado' as const },
  ]

  return (
    <>
      <title>{title}</title>
      <DashboardContent maxWidth="lg">
        <ReferralsHeader
          title={t('translation:referrals.card_title')}
          label={t('translation:referrals.chip')}
          description={t('translation:referrals.description')}
          img={
            <img
              src="/assets/images/herramienta-optimizador-producto-regalo.png"
              alt="Agente optimizador de productos sujetando un regalo mirando hacia abajo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          }
          hoverImg={
            <img
              src="/assets/images/herramienta-optimizador-producto-regalo-sonrisa.png"
              alt="Agente optimizador de productos sujetando un regalo y sonriendo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          }
        ></ReferralsHeader>

        {/* Left column */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)',
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {t('translation:referrals.your_code')}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  mb: 4,
                }}
              >
                {!mockUser?.referral_code ? (
                  <Skeleton variant="rounded" width="100%" height={48} />
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    defaultValue={`https://dapp.aishophelper.ai/signup?ref=${mockUser?.referral_code}`}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    sx={{
                      '.MuiInputBase-input': { height: 16 },
                    }}
                  />
                )}
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCopyCode}
                  sx={{ height: '48px', whiteSpace: 'nowrap', px: 2.5 }}
                >
                  <Iconify icon="solar:copy-bold" width={24} sx={{ mr: 1 }} />
                  {t('translation:referrals.copy')}
                </Button>
              </Box>

              <Menu
                id="share-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
              >
                <MenuList>
                  <MenuItem
                    sx={{ gap: 1 }}
                    onClick={() => handleShare('facebook')}
                  >
                    <>
                      <Iconify icon="socials:facebook" />
                      {t('translation:referrals.share_on_facebook')}
                    </>
                  </MenuItem>
                  <MenuItem
                    sx={{ gap: 1 }}
                    onClick={() => handleShare('linkedin')}
                  >
                    <>
                      <Iconify icon="socials:linkedin" />
                      {t('translation:referrals.share_on_linkedin')}
                    </>
                  </MenuItem>
                  <MenuItem
                    sx={{ gap: 1 }}
                    onClick={() => {
                      console.log('Big Chungus')
                      handleShare('reddit')
                    }}
                  >
                    <>
                      <Iconify icon="socials:reddit" />
                      {t('translation:referrals.share_on_reddit')}
                    </>
                  </MenuItem>
                </MenuList>
              </Menu>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                  fontSize: '0.75rem',
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {t('translation:referrals.share_directly')}
              </Typography>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    onClick={() => handleShare('whatsapp')}
                    fullWidth
                    variant="contained"
                    startIcon={
                      <Iconify icon="ic:baseline-whatsapp" width={24} />
                    }
                    sx={{
                      bgcolor: '#1faf38',
                      '&:hover': { bgcolor: '#60d669' },
                    }}
                  >
                    WhatsApp
                  </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    onClick={() => handleShare('twitter')}
                    fullWidth
                    variant="contained"
                    startIcon={<Iconify icon="prime:twitter" />}
                    sx={{
                      bgcolor: '#000000',
                      '&:hover': { bgcolor: '#444444' },
                    }}
                  >
                    X/Twitter
                  </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    onClick={() => handleShare('email')}
                    fullWidth
                    variant="contained"
                    startIcon={<Iconify icon="ic:round-email" width={24} />}
                    sx={{
                      bgcolor: '#64748B',
                      '&:hover': { bgcolor: '#475569' },
                    }}
                  >
                    Email
                  </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    onClick={handleMenuOpen as any}
                    fullWidth
                    variant="contained"
                    startIcon={<Iconify icon="solar:share-bold" width={24} />}
                    color="secondary"
                  >
                    {t('translation:referrals.more')}
                  </Button>
                </Grid>
              </Grid>
            </Card>

            <HowItWorks />
          </Grid>

          <Grid size={{ xs: 16, md: 4 }}>
            <MonthlyLimitCard />

            <RecentReferralsCard referrals={referrals} />
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  )
}

function RecentReferralsCard({
  referrals,
}: {
  referrals: { name: string; status: 'Liberado' | 'Pendiente'; sub?: string }[]
}) {
  const { t } = useTranslation()
  return (
    <Card
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        bgcolor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        {t('translation:referrals.recent_referrals')}
      </Typography>
      <List disablePadding>
        {referrals.map((ref, index) => (
          <Fragment key={index}>
            <ListItem
              disablePadding
              sx={{ py: 1.5 }}
              secondaryAction={
                <StatusChip
                  label={t(`referrals.${ref.status}` as any)}
                  status={ref.status}
                  size="small"
                />
              }
            >
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={600}>
                    {ref.name}
                  </Typography>
                }
                secondary={
                  ref.sub && (
                    <Typography variant="caption" color="text.secondary">
                      {ref.sub}
                    </Typography>
                  )
                }
              />
            </ListItem>
            {index < referrals.length - 1 && <Divider component="li" />}
          </Fragment>
        ))}
      </List>
    </Card>
  )
}

function MonthlyLimitCard() {
  const { t } = useTranslation()

  return (
    <Card
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        bgcolor: 'rgba(0,0,0,0.8)',
        color: 'common.white',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {t('translation:referrals.monthly_limit')}
        </Typography>
        <Iconify
          icon="solar:info-circle-bold"
          size={16}
          style={{ opacity: 0.7 }}
        />
      </Stack>

      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h3" fontWeight="bold">
          4
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.7 }}>
          / 10
        </Typography>
      </Stack>

      <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
        {t('translation:referrals.referrals_this_month')}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={40}
        sx={{
          height: 6,
          borderRadius: 5,
          bgcolor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': {
            bgcolor: '#3B82F6',
            borderRadius: 5,
          },
        }}
      />

      <Typography
        variant="caption"
        sx={{ display: 'block', mt: 3, opacity: 0.6, lineHeight: 1.6 }}
      >
        {t('translation:referrals.limit_reset')}
      </Typography>
    </Card>
  )
}

function HowItWorks() {
  const { t } = useTranslation()

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
        {t('translation:referrals.how_does_it_work')}
      </Typography>
      <Stack spacing={3}>
        <Box display="flex">
          <StepNumber>1</StepNumber>
          <Box flex={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Typography variant="subtitle2">
                {t('translation:referrals.step_1')}
              </Typography>
              <Iconify icon="lucide:share" size={16} color="#94A3B8" />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('translation:referrals.step_1_description')}
            </Typography>
          </Box>
        </Box>

        <Box display="flex">
          <StepNumber>2</StepNumber>
          <Box flex={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2">
                {t('translation:referrals.step_2')}
              </Typography>
              <Chip
                label={t('translation:referrals.required')}
                size="small"
                sx={{
                  height: 16,
                  fontSize: '0.6rem',
                  bgcolor: '#FEF3C7',
                  color: '#92400E',
                  fontWeight: 'bold',
                }}
              />
              <Box flexGrow={1} />
              <Iconify icon="lucide:globe" size={16} color="#94A3B8" />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('translation:referrals.step_2_description')}
            </Typography>
          </Box>
        </Box>

        <Box display="flex">
          <StepNumber>3</StepNumber>
          <Box flex={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2">
                {t('translation:referrals.step_3')}
              </Typography>
              <Chip
                label={t('translation:referrals.required')}
                size="small"
                sx={{
                  height: 16,
                  fontSize: '0.6rem',
                  bgcolor: '#FEF3C7',
                  color: '#92400E',
                  fontWeight: 'bold',
                }}
              />
              <Box flexGrow={1} />
              <Iconify icon="lucide:zap" size={16} color="#94A3B8" />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('translation:referrals.step_3_description')}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Card>
  )
}

const StepNumber = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '0.875rem',
  marginRight: theme.spacing(2),
  flexShrink: 0,
}))

const StatusChip = styled(Chip)<{ status: 'Liberado' | 'Pendiente' }>(
  ({ status }) => ({
    backgroundColor: status === 'Liberado' ? '#DCFCE7' : '#FEF3C7',
    color: status === 'Liberado' ? '#166534' : '#92400E',
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 24,
  }),
)
