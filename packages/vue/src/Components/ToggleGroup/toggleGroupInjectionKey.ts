// ** External Imports
import type { ComputedRef, InjectionKey } from "vue";

// ** Core Imports
import type { ToggleGroupValue } from "@bridge-ui/core/Domain";

/**
 * Merged token classes for the track and segments.
 */
export type ToggleGroupTokenClasses = {
  colorSelected?: string;
  colorSelectedSoft?: string;
  iconGap?: string;
  iconSize?: string;
  itemOrientation?: string;
  itemRounded?: string;
  itemSize?: string;
  itemVariant?: string;
  itemVariantSelected?: string;
  rootOrientation?: string;
  rootRounded?: string;
  rootSize?: string;
  rootVariant?: string;
  softFill?: boolean;
};

/**
 * Shared toggle group state for `ToggleItem` descendants.
 */
export type ToggleGroupContextValue = {
  /**
   * Whether the entire group is disabled.
   */
  disabled: boolean;

  /**
   * Disabled toggle values.
   */
  disabledValues: string[];

  /**
   * Value that currently owns the roving tab stop.
   */
  focusedValue: string;

  /**
   * Focus a segment by value (roving tabindex).
   */
  focusToggleItem: (value: string) => void;

  /**
   * Whether segments stretch to fill the track width.
   */
  full: boolean;

  /**
   * Stable id prefix for segment ids.
   */
  id: string;

  /**
   * Whether more than one segment can be selected.
   */
  multiple: boolean;

  /**
   * Orientation of the track.
   */
  orientation: "vertical" | "horizontal";

  /**
   * Registers a segment and returns unregister.
   */
  registerToggleItem: (value: string, disabled?: boolean) => () => void;

  /**
   * Currently selected value(s).
   */
  selected: ToggleGroupValue;

  /**
   * Applies a segment press (select / toggle).
   */
  toggleItem: (value: string) => void;

  /**
   * Ordered toggle values (mount order).
   */
  toggleValues: string[];

  /**
   * Merged token classes for the track and segments.
   */
  tokenClasses: ToggleGroupTokenClasses;
};

export const TOGGLE_GROUP_INJECTION_KEY = Symbol(
  "bridge-toggle-group",
) as InjectionKey<ComputedRef<ToggleGroupContextValue>>;
