import { sliderClasses, SliderProps } from "@mui/material/Slider"
import { Components, ComponentsVariants, Theme } from "@mui/material/styles"
import { varAlpha } from "minimal-shared/utils"

// ----------------------------------------------------------------------

const SIZES = ["small", "medium"]
const ORIENTATIONS = ["horizontal", "vertical"]
const DIMENSIONS = {
  small: { rail: 6, thumb: 16, mark: 4 },
  medium: { rail: 10, thumb: 20, mark: 6 },
}

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const thumbVariants: ComponentsVariants<Theme>['MuiSlider'] = [
  ...SIZES.map((size) => ({
    props: (props: SliderProps) => props.size === size,
    style: {
      width: DIMENSIONS[size as keyof typeof DIMENSIONS].thumb,
      height: DIMENSIONS[size as keyof typeof DIMENSIONS].thumb,
    },
  })),
]

const railVariants: ComponentsVariants<Theme>['MuiSlider'] = [
  ...ORIENTATIONS.flatMap((orientation) =>
    SIZES.map((size) => ({
      props: (props: SliderProps) =>
        props.orientation === orientation && props.size === size,
      style:
        orientation === "horizontal"
          ? { height: DIMENSIONS[size as keyof typeof DIMENSIONS].rail }
          : { width: DIMENSIONS[size as keyof typeof DIMENSIONS].rail },
    })),
  ),
]

const trackVariants: ComponentsVariants<Theme>['MuiSlider'] = [
  ...ORIENTATIONS.flatMap((orientation) =>
    SIZES.map((size) => ({
      props: (props: SliderProps) =>
        props.orientation === orientation && props.size === size,
      style:
        orientation === "horizontal"
          ? { height: DIMENSIONS[size as keyof typeof DIMENSIONS].rail }
          : { width: DIMENSIONS[size as keyof typeof DIMENSIONS].rail },
    })),
  ),
]

const markVariants: ComponentsVariants<Theme>['MuiSlider'] = [
  ...ORIENTATIONS.flatMap((orientation) =>
    SIZES.map((size) => ({
      props: (props: SliderProps) =>
        props.orientation === orientation && props.size === size,
      style:
        orientation === "horizontal"
          ? { width: 1, height: DIMENSIONS[size as keyof typeof DIMENSIONS].mark }
          : { height: 1, width: DIMENSIONS[size as keyof typeof DIMENSIONS].mark },
    })),
  ),
]

const markActiveVariants: ComponentsVariants<Theme>['MuiSlider'] = [
  {
    props: (props) => props.color === "inherit" as any,
    style: ({ theme }) => ({
      ...theme.applyStyles("dark", {
        backgroundColor: varAlpha(theme.vars.palette.grey["800Channel"], 0.48),
      }),
    }),
  },
]

const disabledVariants: ComponentsVariants<Theme>['MuiSlider'] = [
  {
    props: {},
    style: ({ theme }) => ({
      [`&.${sliderClasses.disabled}`]: {
        color: theme.vars.palette.action.disabled,
      },
    }),
  },
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiSlider: Components<Theme>['MuiSlider'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    size: "small",
  },

  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    thumb: ({ theme }) => ({
      boxShadow: theme.vars.customShadows.z1,
      color: theme.vars.palette.common.white,
      border: `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.08)}`,
      "&::before": {
        opacity: 0.4,
        boxShadow: "none",
        width: "calc(100% - 4px)",
        height: "calc(100% - 4px)",
        backgroundImage: `linear-gradient(180deg, ${theme.vars.palette.grey[500]}, transparent)`,
        ...theme.applyStyles("dark", {
          opacity: 0.8,
        }),
      },
    }),
    rail: ({ theme }) => ({
      opacity: 0.12,
      backgroundColor: theme.vars.palette.grey[500],
    }),
    mark: ({ style, theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.48),
      '&[data-index="0"]': { display: "none" },
      ...((style?.left || style?.bottom) === "100%" && { display: "none" }),
    }),
    markActive: ({ theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.common.whiteChannel, 0.64),
    }),
    markLabel: ({ theme }) => ({
      fontSize: theme.typography.pxToRem(13),
      color: theme.vars.palette.text.disabled,
    }),
    valueLabel: ({ theme }) => ({
      borderRadius: 8,
      backgroundColor: theme.vars.palette.grey[800],
      ...theme.applyStyles("dark", {
        backgroundColor: theme.vars.palette.grey[700],
      }),
    }),
  },
  variants: [
    ...disabledVariants,
    ...thumbVariants.map(v => ({
      ...v,
      style: { [`& .${sliderClasses.thumb}`]: v.style }
    })),
    ...railVariants.map(v => ({
      ...v,
      style: { [`& .${sliderClasses.rail}`]: v.style }
    })),
    ...trackVariants.map(v => ({
      ...v,
      style: { [`& .${sliderClasses.track}`]: v.style }
    })),
    ...markVariants.map(v => ({
      ...v,
      style: { [`& .${sliderClasses.mark}`]: v.style }
    })),
    ...markActiveVariants.map(v => ({
      ...v,
      style: { [`& .${sliderClasses.markActive}`]: v.style }
    })),
  ],
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const slider = {
  MuiSlider,
}
