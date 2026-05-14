// ** Exports
export type {
  AlertColor,
  AlertColorItem,
  AlertPadding,
  AlertRounded,
  AlertShadow,
  AlertVariant,
} from "@core/Components/Alert";
export type {
  ButtonColor,
  ButtonColorItem,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from "@core/Components/Button";
export type { IconSize } from "@core/Components/Icon";
export type { MiniButtonSize } from "@core/Components/MiniButton";
export {
  BRIDGE_UI_DEFAULT_GLOBAL,
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  resolveBridgeUIOptions,
} from "@core/Config";
export type {
  AlertConfigOverrides,
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  BridgeUIOptions,
  ButtonConfigOverrides,
  Direction,
  IconConfigOverrides,
  MiniButtonConfigOverrides,
} from "@core/Config";
export {
  cn,
  mergeBridgeUILayeredClasses,
  mergeBridgeUIStringMap,
  mergePropsWithBridgeUIDefaults,
} from "@core/Utils";
export type { MergeProps, Overwrite, UnionProps } from "@core/Utils";
