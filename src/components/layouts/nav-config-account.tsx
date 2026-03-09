import { paths } from '../../utils/paths'
import { Iconify } from '../../components/iconify'

// ----------------------------------------------------------------------

export const _account = [
  {
    label: 'layout.profile',
    href: paths.settings.general,
    icon: <Iconify icon="custom:profile-duotone" />,
  },
  {
    label: 'layout.projects',
    href: paths.settings.projects,
    icon: <Iconify icon="solar:notes-bold-duotone" />,
    // info: "3",
  },
  {
    label: 'layout.subscription_and_billing',
    href: paths.settings.billing,
    icon: <Iconify icon="custom:invoice-duotone" />,
  },
  {
    label: 'layout.notifications',
    href: paths.settings.notifications,
    icon: <Iconify icon="solar:bell-bing-bold-duotone" />,
  },
  {
    label: 'layout.security',
    href: paths.settings.changePassword,
    icon: <Iconify icon="solar:shield-keyhole-bold-duotone" />,
  },
  {
    label: 'layout.appearance',
    href: paths.settings.appearance,
    icon: <Iconify icon="solar:pallete-2-bold-duotone" />,
  },
]
