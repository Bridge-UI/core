// ** Augments
import "@/augments";

// ** Exports
export {
  setI18nAdapterForTests,
  useI18nAdapter,
  useResolveMessage,
} from "@/Adapters/I18n";
export { setIconAdapterForTests, useIconAdapter } from "@/Adapters/Icon";
export type {
  IconElement,
  IconSource,
  SemanticIconName,
} from "@/Adapters/Icon";
export { Alert, useAlert } from "@/Components/Alert";
export type {
  AlertClasses,
  AlertColorOverrides,
  AlertPaddingOverrides,
  AlertProps,
  AlertRoundedOverrides,
  AlertShadowOverrides,
  AlertSlots,
  AlertVariantOverrides,
} from "@/Components/Alert";
export { Autocomplete, AutocompleteOption } from "@/Components/Autocomplete";
export type {
  AutocompleteClasses,
  AutocompleteEmits,
  AutocompleteOptionData,
  AutocompleteOptionProps,
  AutocompleteProps,
  AutocompleteSlots,
} from "@/Components/Autocomplete";
export { Avatar } from "@/Components/Avatar";
export type {
  AvatarClasses,
  AvatarColorOverrides,
  AvatarCustomProps,
  AvatarProps,
  AvatarRoundedOverrides,
  AvatarSizeOverrides,
  AvatarSlots,
} from "@/Components/Avatar";
export { Badge, useBadge } from "@/Components/Badge";
export type {
  BadgeClasses,
  BadgeColorOverrides,
  BadgeDensityOverrides,
  BadgeOwnProps,
  BadgeProps,
  BadgeRoundedOverrides,
  BadgeSizeOverrides,
  BadgeSlots,
  BadgeVariantOverrides,
} from "@/Components/Badge";
export { BaseField, useBaseField } from "@/Components/BaseField";
export type {
  BaseFieldClasses,
  BaseFieldCustomProps,
  BaseFieldOptions,
  BaseFieldOwnProps,
  BaseFieldProps,
  BaseFieldSizeOverrides,
  BaseFieldSlots,
  UseBaseFieldReturn,
} from "@/Components/BaseField";
export { Button, useButton } from "@/Components/Button";
export type {
  ButtonClasses,
  ButtonColorOverrides,
  ButtonDensityOverrides,
  ButtonProps,
  ButtonRoundedOverrides,
  ButtonSizeOverrides,
  ButtonSlots,
  ButtonVariantOverrides,
} from "@/Components/Button";
export { Card, useCard } from "@/Components/Card";
export type {
  CardClasses,
  CardCustomProps,
  CardOwnProps,
  CardPaddingOverrides,
  CardProps,
  CardRoundedOverrides,
  CardShadowOverrides,
  CardSlots,
  CardVariantOverrides,
} from "@/Components/Card";
export { Checkbox, useCheckbox } from "@/Components/Checkbox";
export type {
  CheckboxClasses,
  CheckboxColorOverrides,
  CheckboxCustomProps,
  CheckboxOwnProps,
  CheckboxProps,
  CheckboxRoundedOverrides,
  CheckboxSizeOverrides,
  CheckboxSlots,
} from "@/Components/Checkbox";
export { Chip, useChip } from "@/Components/Chip";
export type {
  ChipClasses,
  ChipCustomProps,
  ChipEmits,
  ChipOwnProps,
  ChipProps,
  ChipSizeOverrides,
  ChipSlots,
} from "@/Components/Chip";
export { Divider, useDivider } from "@/Components/Divider";
export type {
  DividerClasses,
  DividerColorOverrides,
  DividerOrientationOverrides,
  DividerOwnProps,
  DividerProps,
} from "@/Components/Divider";
export { Drawer, useDrawer } from "@/Components/Drawer";
export type {
  DrawerBlurOverrides,
  DrawerClasses,
  DrawerCustomProps,
  DrawerEmits,
  DrawerOwnProps,
  DrawerPlacementOverrides,
  DrawerProps,
  DrawerScrollOverrides,
  DrawerSizeOverrides,
  DrawerSlots,
  DrawerTransitionOverrides,
} from "@/Components/Drawer";
export { FormControl, useFormControl } from "@/Components/FormControl";
export type {
  FormControlClasses,
  FormControlCustomProps,
  FormControlOwnProps,
  FormControlProps,
  FormControlSizeOverrides,
  FormControlSlots,
  UseFormControlReturn,
} from "@/Components/FormControl";
export { FormField, useFormField } from "@/Components/FormField";
export type {
  FormFieldClasses,
  FormFieldColorOverrides,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldProps,
  FormFieldRoundedOverrides,
  FormFieldSizeOverrides,
  FormFieldSlots,
  FormFieldVariantOverrides,
  UseFormFieldReturn,
} from "@/Components/FormField";
export { Icon, type IconOwnProps, type IconProps } from "@/Components/Icon";
export type { IconSizeOverrides } from "@/Components/Icon";
export { Label, useLabel } from "@/Components/Label";
export type {
  LabelClasses,
  LabelOwnProps,
  LabelProps,
  LabelSizeOverrides,
} from "@/Components/Label";
export { Link, useLink } from "@/Components/Link";
export type {
  LinkClasses,
  LinkColorOverrides,
  LinkCustomProps,
  LinkOwnProps,
  LinkProps,
  LinkSizeOverrides,
  LinkSlots,
  LinkUnderlineOverrides,
} from "@/Components/Link";
export { List, useList } from "@/Components/List";
export type {
  ListClasses,
  ListContextValue,
  ListCustomProps,
  ListOwnProps,
  ListProps,
} from "@/Components/List";
export {
  Listbox,
  findFirstEnabledOptionIndex,
  findLastEnabledOptionIndex,
  getListboxActiveDescendantId,
  getListboxOptionId,
  moveListboxHighlight,
  useListbox,
  useListboxNavigation,
} from "@/Components/Listbox";
export type {
  ListboxClasses,
  ListboxColorOverrides,
  ListboxCustomProps,
  ListboxEmits,
  ListboxOption,
  ListboxOwnProps,
  ListboxProps,
  ListboxSlots,
  ListboxValue,
} from "@/Components/Listbox";
export { ListItem } from "@/Components/ListItem";
export type {
  ListItemClasses,
  ListItemCustomProps,
  ListItemOwnProps,
  ListItemProps,
  ListItemSlots,
} from "@/Components/ListItem";
export { ListSection } from "@/Components/ListSection";
export type {
  ListSectionClasses,
  ListSectionCustomProps,
  ListSectionOwnProps,
  ListSectionProps,
  ListSectionSlots,
} from "@/Components/ListSection";
export { Menu, useMenu } from "@/Components/Menu";
export type {
  MenuClasses,
  MenuCustomProps,
  MenuEmits,
  MenuOptions,
  MenuOwnProps,
  MenuProps,
  MenuRoundedOverrides,
  MenuShadowOverrides,
  MenuSlots,
} from "@/Components/Menu";
export { Modal, useModal } from "@/Components/Modal";
export type {
  ModalAlignOverrides,
  ModalBlurOverrides,
  ModalClasses,
  ModalCustomProps,
  ModalEmits,
  ModalOwnProps,
  ModalProps,
  ModalSizeOverrides,
  ModalSlots,
} from "@/Components/Modal";
export { NumberField, useNumberField } from "@/Components/NumberField";
export type {
  NumberFieldClasses,
  NumberFieldCustomProps,
  NumberFieldOwnProps,
  NumberFieldProps,
  NumberFieldSlots,
} from "@/Components/NumberField";
export { OtpField, useOtpField } from "@/Components/OtpField";
export type {
  OtpFieldClasses,
  OtpFieldCustomProps,
  OtpFieldEmits,
  OtpFieldOwnProps,
  OtpFieldProps,
  OtpFieldSlots,
  UseOtpFieldOptions,
} from "@/Components/OtpField";
export { PasswordField, usePasswordField } from "@/Components/PasswordField";
export type {
  PasswordFieldClasses,
  PasswordFieldCustomProps,
  PasswordFieldOwnProps,
  PasswordFieldProps,
  PasswordFieldSlots,
} from "@/Components/PasswordField";
export { Progress, useProgress } from "@/Components/Progress";
export type {
  ProgressClasses,
  ProgressColorOverrides,
  ProgressCustomProps,
  ProgressOwnProps,
  ProgressProps,
  ProgressRoundedOverrides,
  ProgressSizeOverrides,
  ProgressVariantOverrides,
} from "@/Components/Progress";
export { Radio, useRadio } from "@/Components/Radio";
export type {
  RadioClasses,
  RadioColorOverrides,
  RadioCustomProps,
  RadioOwnProps,
  RadioProps,
  RadioRoundedOverrides,
  RadioSizeOverrides,
  RadioSlots,
} from "@/Components/Radio";
export { Select, SelectOption } from "@/Components/Select";
export type {
  SelectAsyncData,
  SelectClasses,
  SelectEmits,
  SelectModel,
  SelectOptionData,
  SelectOptionProps,
  SelectProps,
  SelectSlots,
  SelectValue,
} from "@/Components/Select";
export { Skeleton, useSkeleton } from "@/Components/Skeleton";
export type {
  SkeletonClasses,
  SkeletonOwnProps,
  SkeletonProps,
  SkeletonRoundedOverrides,
} from "@/Components/Skeleton";
export { Slider, useSlider } from "@/Components/Slider";
export type {
  SliderClasses,
  SliderColorOverrides,
  SliderCustomProps,
  SliderEmits,
  SliderOwnProps,
  SliderProps,
  SliderRangeValue,
  SliderRoundedOverrides,
  SliderSizeOverrides,
  SliderSlots,
  SliderStop,
  SliderStopInput,
  UseSliderOptions,
  UseSliderReturn,
} from "@/Components/Slider";
export { Snackbar, useSnackbar } from "@/Components/Snackbar";
export type {
  SnackbarClasses,
  SnackbarColorOverrides,
  SnackbarCustomProps,
  SnackbarEmits,
  SnackbarOwnProps,
  SnackbarPaddingOverrides,
  SnackbarProps,
  SnackbarSlots,
  SnackbarTransitionOverrides,
} from "@/Components/Snackbar";
export { Spinner, useSpinner } from "@/Components/Spinner";
export type {
  SpinnerClasses,
  SpinnerColorOverrides,
  SpinnerCustomProps,
  SpinnerOwnProps,
  SpinnerProps,
  SpinnerSizeOverrides,
  SpinnerVariantOverrides,
} from "@/Components/Spinner";
export { Switch, useSwitch } from "@/Components/Switch";
export type {
  SwitchClasses,
  SwitchColorOverrides,
  SwitchCustomProps,
  SwitchOwnProps,
  SwitchProps,
  SwitchRoundedOverrides,
  SwitchSizeOverrides,
  SwitchSlots,
} from "@/Components/Switch";
export { Tab, useTab } from "@/Components/Tab";
export type {
  TabClasses,
  TabCustomProps,
  TabOwnProps,
  TabProps,
  TabSlots,
} from "@/Components/Tab";
export { TabItem, useTabItem } from "@/Components/TabItem";
export type {
  TabItemClasses,
  TabItemOwnProps,
  TabItemProps,
  TabItemSlots,
} from "@/Components/TabItem";
export { TabList, useTabList } from "@/Components/TabList";
export type {
  TabListClasses,
  TabListCustomProps,
  TabListOwnProps,
  TabListProps,
  TabListSlots,
} from "@/Components/TabList";
export { TabPanel, useTabPanel } from "@/Components/TabPanel";
export type {
  TabPanelClasses,
  TabPanelCustomProps,
  TabPanelOwnProps,
  TabPanelProps,
  TabPanelSlots,
} from "@/Components/TabPanel";
export { TABS_INJECTION_KEY, Tabs, useTabs } from "@/Components/Tabs";
export type {
  TabsClasses,
  TabsColorOverrides,
  TabsContextValue,
  TabsCustomProps,
  TabsEmits,
  TabsItemEntry,
  TabsOrientationOverrides,
  TabsOwnProps,
  TabsProps,
  TabsSizeOverrides,
  TabsSlots,
  TabsTokenClasses,
  TabsVariantOverrides,
} from "@/Components/Tabs";
export { Textarea, useTextarea } from "@/Components/Textarea";
export type {
  TextareaClasses,
  TextareaCustomProps,
  TextareaOwnProps,
  TextareaProps,
  TextareaSlots,
} from "@/Components/Textarea";
export { TextField, useTextField } from "@/Components/TextField";
export type {
  TextFieldClasses,
  TextFieldCustomProps,
  TextFieldOwnProps,
  TextFieldProps,
  TextFieldSlots,
} from "@/Components/TextField";
export { Tooltip, useTooltip } from "@/Components/Tooltip";
export type {
  TooltipClasses,
  TooltipColorOverrides,
  TooltipCustomProps,
  TooltipEmits,
  TooltipOptions,
  TooltipOwnProps,
  TooltipProps,
  TooltipRoundedOverrides,
  TooltipSizeOverrides,
  TooltipSlots,
} from "@/Components/Tooltip";
export { BridgeUIProvider, createBridgeUI, useBridgeUI } from "@/Provider";
export type { BridgeUIContextApi } from "@/Provider";
export {
  useBreakpoint,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
export type { UseBreakpointOptions } from "@/Utils";
export {
  BRIDGE_UI_DEFAULT_GLOBAL,
  SEMANTIC_ICON_NAMES,
  cn,
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  resolveBridgeUIOptions,
  resolveMessage,
} from "@bridge-ui/core";
export type {
  I18nAdapter,
  IconAdapter,
  SemanticIconNameOverrides,
} from "@bridge-ui/core";
