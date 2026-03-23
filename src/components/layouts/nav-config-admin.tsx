import { UserPublic } from '../../../api/model'
import { Iconify } from '../../components/iconify'
import { CONFIG } from '../../global-config'
import { paths } from '../../utils/paths'
import { Label } from '../label'

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Admin navbar
   */
  {
    items: [
      {
        title: 'Inicio',
        path: paths.adminPanel.root,
        allowClick: true,
        icon: <Iconify width={18} icon="solar:home-bold-duotone" />,
        info: <Label>v{CONFIG.appVersion}</Label>,
        visible: (user: UserPublic) => user?.is_superuser,
      },
      {
        title: 'Usuarios',
        path: paths.adminPanel.users,
        icon: (
          <Iconify
            width={18}
            icon="solar:users-group-two-rounded-bold-duotone"
          />
        ),
        visible: (user: UserPublic) => user?.is_superuser,
      },
      {
        title: 'Agentes',
        path: paths.adminPanel.agents,
        icon: <Iconify width={18} icon="solar:user-hand-up-bold-duotone" />,
        visible: (user: UserPublic) => user?.is_superuser,
      },
      {
        title: 'Volver a la app',
        path: '/',
        // render this item in the bottom nav area
        position: 'bottom',
        icon: <Iconify width={18} icon="solar:exit-bold-duotone" />,
      },
    ],
  },
]
