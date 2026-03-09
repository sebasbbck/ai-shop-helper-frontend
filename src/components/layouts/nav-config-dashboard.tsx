import { UserPublic } from '../../../api/model'
import { Iconify } from '../../components/iconify'
import { paths } from '../../utils/paths'

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    items: [
      /*{
        title: "Inicio",
        path: "/",
        icon: <Iconify width={18} icon="solar:home-bold-duotone" />,
        info: <Label>v{CONFIG.appVersion}</Label>,
      },*/
      {
        title: 'layout.team',
        path: paths.dashboard.root,
        allowClick: true,
        icon: (
          <Iconify
            width={18}
            icon="solar:users-group-two-rounded-bold-duotone"
          />
        ),
        children: [
          { title: 'team.agents.blog.title', path: paths.agents.blogWriter },
          // { title: 'team.agents.social_media.title', path: paths.agents.socialMediaManager },
        ],
      },
      {
        title: 'layout.inbox',
        path: paths.inbox,
        icon: <Iconify width={18} icon="solar:inbox-in-bold-duotone" />,
        notificationCount: 1,
      },
      /*{
        title: "layout.integrations",
        path: paths.integrations,
        icon: <Iconify width={18} icon="icon-park-twotone:connect" />,
      },*/
      {
        title: 'layout.referrals',
        path: paths.referrals,
        // render this item in the bottom nav area
        position: 'bottom',
        icon: <Iconify width={18} icon="fluent-emoji-flat:wrapped-gift" />,
      },
      {
        // show Admin Panel only for admin users
        title: 'layout.admin',
        path: paths.adminPanel.root,
        icon: (
          <Iconify
            width={18}
            icon="solar:shield-keyhole-minimalistic-bold-duotone"
          />
        ),
        visible: (user: UserPublic) => user?.is_superuser,
      },
    ],
  },
]
