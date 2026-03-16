import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { Iconify } from '../../../../components/iconify'

export function SettingsHead({ t, handleReset }) {
  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {t('settings.appearance.title')}
      </Typography>

      <Tooltip title={t('settings.appearance.tooltip')}>
        {handleReset && (
          <IconButton onClick={handleReset}>
            <Badge color="error" variant="dot">
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        )}
      </Tooltip>
    </Box>
  )
}
