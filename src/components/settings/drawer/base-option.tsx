import ButtonBase from "@mui/material/ButtonBase"

import Switch from "@mui/material/Switch"
import { styled, SxProps, Theme } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"
import { varAlpha } from "minimal-shared/utils"

import { Iconify } from "../../iconify"
import { ReactNode } from "react"

// ----------------------------------------------------------------------

interface BaseOptionProps {
  sx?: SxProps<Theme>,
  icon: ReactNode,
  label: string,
  action?: ReactNode,
  tooltip?: string,
  selected: boolean,
  onChangeOption: () => void,
  [key: string]: any
}

export function BaseOption({
  sx,
  icon,
  label,
  action,
  tooltip,
  selected,
  onChangeOption,
  ...other
}: BaseOptionProps) {
  return (
    <ItemRoot
      disableRipple
      selected={selected}
      onClick={onChangeOption}
      sx={sx}
      {...other}
    >
      <TopContainer>
        {icon}
        {action ?? (
          <Switch
            name={label}
            size="small"
            color="primary"
            checked={selected}
            sx={{ mr: -0.75 }}
          />
        )}
      </TopContainer>

      <BottomContainer>
        <ItemLabel>{label}</ItemLabel>

        {tooltip && (
          <Tooltip
            arrow
            title={tooltip}
            slotProps={{ tooltip: { sx: { maxWidth: 240, mr: 0.5 } } }}
          >
            <Iconify
              width={16}
              icon="eva:info-outline"
              sx={{ cursor: "pointer", color: "text.disabled" }}
              className={undefined}
              height={undefined}
            />
          </Tooltip>
        )}
      </BottomContainer>
    </ItemRoot>
  )
}

// ----------------------------------------------------------------------

interface ItemRootProps {
  selected: boolean
}

const ItemRoot = styled(ButtonBase, {
  shouldForwardProp: (prop) => !["selected", "sx"].includes(prop as string),
})<ItemRootProps>(({ selected, theme }) => {
  // Now TS knows theme.vars exists and grey has '500Channel'
  const grey500Channel = theme.vars.palette.grey['500Channel']

  return {
    cursor: "pointer",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: theme.spacing(2, 2, 2, 2.5),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    border: `solid 1px ${varAlpha(grey500Channel, 0.12)}`,
    "&:hover": {
      backgroundColor: varAlpha(grey500Channel, 0.08),
    },
    ...(selected && {
      backgroundColor: varAlpha(grey500Channel, 0.08),
    }),
  }
})

const TopContainer = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  justifyContent: "space-between",
}))

const BottomContainer = styled("div")(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}))

const ItemLabel = styled("span")(({ theme }) => ({
  lineHeight: "18px",
  fontSize: theme.typography.pxToRem(13),
  fontWeight: theme.typography.fontWeightBold,
}))
