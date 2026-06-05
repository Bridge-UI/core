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
  AvatarColor,
  AvatarColorItem,
  AvatarRounded,
  AvatarSize,
} from "@core/Components/Avatar";
export type {
  BadgeColor,
  BadgeColorItem,
  BadgeDensity,
  BadgeRounded,
  BadgeSize,
  BadgeVariant,
} from "@core/Components/Badge";
export type {
  ButtonColor,
  ButtonColorItem,
  ButtonDensity,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from "@core/Components/Button";
export type {
  CardPadding,
  CardPaddingItem,
  CardRounded,
  CardRoundedItem,
  CardShadow,
  CardVariant,
  CardVariantItem,
} from "@core/Components/Card";
export type {
  CheckboxColor,
  CheckboxColorItem,
  CheckboxRounded,
  CheckboxSize,
} from "@core/Components/Checkbox";
export type {
  FormFieldColor,
  FormFieldColorItem,
  FormFieldRounded,
  FormFieldRoundedItem,
  FormFieldSize,
  FormFieldSizeItem,
  FormFieldVariant,
  FormFieldVariantItem,
} from "@core/Components/FormField";
export type { IconSize } from "@core/Components/Icon";
export type { LabelSize } from "@core/Components/Label";
export type {
  LinkColor,
  LinkColorItem,
  LinkSize,
  LinkUnderline,
} from "@core/Components/Link";
export type { MenuRounded, MenuShadow } from "@core/Components/Menu";
export { transitionProps } from "@core/Components/Modal";
export type {
  ModalAlign,
  ModalBlur,
  ModalSize,
  ModalTransition,
  ModalTransitionLayer,
} from "@core/Components/Modal";
export type {
  RadioColor,
  RadioColorItem,
  RadioRounded,
  RadioSize,
} from "@core/Components/Radio";
export type {
  SelectColor,
  SelectColorItem,
  SelectRounded,
  SelectSize,
  SelectVariant,
} from "@core/Components/Select";
export type { TextareaResize } from "@core/Components/Textarea";
export type {
  ToggleColor,
  ToggleColorItem,
  ToggleRounded,
  ToggleSize,
  ToggleSizeItem,
} from "@core/Components/Toggle";
export {
  BRIDGE_UI_DEFAULT_GLOBAL,
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  resolveBridgeUIOptions,
} from "@core/Config";
export type {
  AlertConfigOverrides,
  AvatarConfigOverrides,
  BadgeConfigOverrides,
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  BridgeUIOptions,
  ButtonConfigOverrides,
  CardConfigOverrides,
  CheckboxConfigOverrides,
  Direction,
  FormFieldConfigOverrides,
  IconConfigOverrides,
  LabelConfigOverrides,
  LinkConfigOverrides,
  MenuConfigOverrides,
  ModalConfigOverrides,
  NumberFieldConfigOverrides,
  PasswordFieldConfigOverrides,
  RadioConfigOverrides,
  SelectConfigOverrides,
  SwitcherConfigOverrides,
  TextareaConfigOverrides,
  ToggleConfigOverrides,
} from "@core/Config";
export {
  LAYER_STACK_BASE_Z_INDEX,
  acquireLayerStackOrder,
  adjustAutosizeTextareaHeight,
  closeLayer,
  closeTopLayer,
  cn,
  countModalTransitionLayers,
  createLayerId,
  createMergePartBind,
  createOpenLayerEntry,
  getLayerCount,
  getLayerStackEntry,
  getLayerStackSnapshot,
  getModalOverlayTransitionClass,
  getModalPanelTransitionClass,
  hasModalTransition,
  hideLayer,
  isLayerMounted,
  isLayerStackTop,
  isModalBackdropClick,
  mergeBridgeUILayeredClasses,
  mergePropsWithBridgeUIDefaults,
  pushLayerStack,
  removeLayer,
  resetLayerStackForTests,
  resolveEffectiveModalTransition,
  resolveModalPortalElement,
  splitComponentProps,
  subscribeLayerStack,
  updateLayer,
} from "@core/Utils";
export type {
  ClassPropKey,
  LayerId,
  LayerRegistryEntry,
  LayerStackHandle,
  LayerStackSnapshotEntry,
  LibDefaultsShape,
  MergeHtmlProps,
  MergeLibDefaults,
  MergePartBind,
  MergeProps,
  Overwrite,
  UnionProps,
} from "@core/Utils";
