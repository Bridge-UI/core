// ** External Imports
import { createContext, useContext } from "react";

// ** Core Imports
import type { AccordionValue } from "@bridge-ui/core/Domain";

/**
 * Shared accordion state for `AccordionItem` children.
 */
export type AccordionContextValue = {
  /**
   * Whether the entire accordion is disabled.
   */
  disabled: boolean;

  /**
   * Disabled item values.
   */
  disabledValues: string[];

  /**
   * Expanded value(s).
   */
  expanded: AccordionValue;

  /**
   * Focus a trigger by item value (arrow navigation).
   */
  focusTrigger: (value: string) => void;

  /**
   * Stable id prefix for trigger / panel pairing.
   */
  id: string;

  /**
   * Ordered item values (mount order).
   */
  itemValues: string[];

  /**
   * Whether more than one item may be expanded.
   */
  multiple: boolean;

  /**
   * Registers an item and returns unregister.
   */
  registerItem: (value: string, disabled?: boolean) => () => void;

  /**
   * Toggles an item by value.
   */
  toggleItem: (value: string) => void;

  /**
   * Merged token classes for items / triggers / panels.
   */
  tokenClasses: {
    colorIndicator?: string;
    colorTriggerExpanded?: string;
    iconSize?: string;
    itemSize?: string;
    itemVariant?: string;
    panelSize?: string;
    panelVariant?: string;
    rootSize?: string;
    rootVariant?: string;
    triggerSize?: string;
    triggerVariant?: string;
  };
};

export const AccordionContext = createContext<null | AccordionContextValue>(
  null,
);

/**
 * Reads the nearest `Accordion` context. Throws when used outside `Accordion`.
 */
export function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion provider");
  }

  return context;
}
