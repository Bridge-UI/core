export interface AlertShadow {
  none: string;
  xs: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  inner: string;
}

export const shadowProps: AlertShadow = {
  none: "shadow-none",
  xs: "shadow-xs",
  sm: "shadow-sm",
  base: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  xxl: "shadow-2xl",
  inner: "inset-shadow-sm",
};
