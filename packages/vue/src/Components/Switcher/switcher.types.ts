// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { LabelSize, MergeProps } from "@bridge-ui/core";

// ** Local Imports
import type { LabelOwnProps } from "@/Components/Label/label.types";
import type { UseSwitcherReturn } from "@/Components/Switcher/composables/useSwitcher";

export interface SwitcherSizeOverrides {}

export interface SwitcherClasses {
  description?: string;
  errorMessage?: string;
  label?: string;
  leftLabel?: string;
  row?: string;
  root?: string;
}

export interface SwitcherPartsProps {
  description?: HTMLAttributes;
  errorMessage?: HTMLAttributes;
  label?: Partial<Omit<LabelOwnProps, "children">>;
  leftLabel?: Partial<Omit<LabelOwnProps, "children">>;
  row?: HTMLAttributes;
  root?: HTMLAttributes;
}

export interface SwitcherSlots {
  description?: Slot;
  errorMessage?: Slot;
  label?: Slot;
  leftLabel?: Slot;
}

export interface SwitcherOwnProps {
  classes?: SwitcherClasses;
  controlId?: string;
  description?: string;
  disabled?: boolean;
  errorless?: boolean;
  error?: boolean;
  errorMessage?: string;
  field?: UseSwitcherReturn;
  label?: string;
  leftLabel?: string;
  partsProps?: SwitcherPartsProps;
  readonly?: boolean;
  required?: boolean;
  size?: MergeProps<LabelSize, SwitcherSizeOverrides>;
  withValidationColors?: boolean;
  withoutErrorMessage?: boolean;
}

export type SwitcherProps = SwitcherOwnProps;
