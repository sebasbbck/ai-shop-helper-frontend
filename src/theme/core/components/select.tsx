import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon"

// ----------------------------------------------------------------------

/* **********************************************************************
 * ♉️ Custom icons
 * **********************************************************************/
const ArrowDownIcon = (props: SvgIconProps) => (
  // https://icon-sets.iconify.design/eva/arrow-ios-downward-fill/
  <SvgIcon {...props}>
    <path
      fill="currentColor"
      d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15a1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16"
    />
  </SvgIcon>
)

const arrowStyles = {
  right: 10,
  width: 18,
  height: 18,
  top: "calc(50% - 9px)",
}

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiSelect = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    IconComponent: ArrowDownIcon,
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    icon: {
      ...arrowStyles,
    },
  },
}

const MuiNativeSelect = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    IconComponent: ArrowDownIcon,
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    icon: {
      ...arrowStyles,
    },
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const select = {
  MuiSelect,
  MuiNativeSelect,
}
