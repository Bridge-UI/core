// ** External Imports
import { createContext, useContext } from "react";

// ** Core Imports
import type { ToggleGroupValue } from "@bridge-ui/core/Domain";

/**
 * Shared toggle group state for `ToggleItem` children.
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
  tokenClasses: {
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
};

export const ToggleGroupContext = createContext<null | ToggleGroupContextValue>(
  null,
);

/**
 * Reads the nearest `ToggleGroup` context. Throws when used outside `ToggleGroup`.
 */
export function useToggleGroupContext(): ToggleGroupContextValue {
  const context = useContext(ToggleGroupContext);

  if (!context) {
    throw new Error("ToggleItem must be used within a ToggleGroup provider");
  }

  return context;
}
